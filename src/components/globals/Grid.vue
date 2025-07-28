<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data(){
		return {
			loading: false,
			confirmBulkEdit: false,
			response: {},
			entities: [],
			selected: [],
		}
	},
	inject: ['symfony', 'alert', 'updateLocalStorage'],
	props: ['columns', 'searchState', 'api', 'bulkEdits', 'entity', 'defaultParams', 'rowClasses'],
	computed: {
		caretClasses() {
			if( this.searchState.order_by_direction === 'desc' ) return 'bi bi-caret-down';
			else return 'bi bi-caret-up';
		},
		pageCount(){
			if( !this.searchState.count ) return 1;
			return Math.ceil( this.searchState.count / this.searchState.per_page );
		}
	},
	methods: {
		getEntities( params ){
			if( params )
				this.searchState.urlParams = params;
			else if( this.searchState.urlParams )
				params = this.searchState.urlParams;
			else
				params = ''

			if( this.defaultParams && this.defaultParams.length ){
				if( params.length ) params += ('&' + this.defaultParams);
				else params = this.defaultParams;
			}

			let order_by = '?'
			if( this.searchState.order_by ){
				order_by += `order_by=${this.searchState.order_by}&order_by_direction=${this.searchState.order_by_direction}&`;
			}

			if( this.searchState.page ){
				order_by += `page=${this.searchState.page}&per_page=${this.searchState.per_page}&`;
			}

			let self = this;
			let url =
			  this.api + order_by + params ?? ''

			self.loading = true;
			utils.ajax(url, (data) => {
				self.response = data;
				self.entities = data.results;
				Object.keys( data.search ).forEach( key => {
					self.searchState[key] = data.search[key];
				})
				self.searchState.urlParams = params;
				self.loading = false;
			})

			this.updateLocalStorage('search');
		},
		orderBy( type )
		{
			if( !type ) return;
			this.searchState.order_by = type;
			if( !this.searchState.order_by_direction ){
				this.searchState.order_by_direction = 'desc';
			} else{
				if( this.searchState.order_by_direction === 'asc' ) this.searchState.order_by_direction = 'desc';
				else this.searchState.order_by_direction = 'asc';
			}
			this.getEntities();
		},
		changePage(page) {
			this.searchState.page = page;
			this.getEntities();
			window.scrollTo(0,0);
		},
		getPageClasses( page ) {
			return 'page-item' + (page === parseInt(this.searchState.page) ? ' active' : '');
		},
		async submitBulkEdits(e)
		{
			e.preventDefault();
			let params = utils.form.paramsToArray( this.$refs.bulkEditForm, true )
			if( !params.length ) return;

			let entities = [];

			this.selected.forEach( id => {
				params.forEach( p => {
					entities.push({
						id: id,
						column: p.name,
						value: p.value,
					})
				})
			})

			let api = this.symfony.api.entity.save.replace(':type', this.entity);
			let data = {entities: entities}

			let response;
			this.loading = true;

			try {
				response = await utils.ajaxAsync(api, data);
				this.loading = false;
			} catch (e) {
				this.loading = false;
				this.alert('Unable to save item(s)', 'danger', e.message);
				return;
			}

			this.confirmBulkEdit = false;

			if( !response || response.error === true ){
				this.alert('Could not save item(s)', 'danger');
				return;
			}

			this.alert(`Item(s) Saved!`);

			this.getEntities();
		},
		getRowClasses( item ){
			if( typeof this.rowClasses === 'function' ) return this.rowClasses( item );
			if( item.bg_success ) return 'table-success';
			return '';
		}
	},
	watch: {
		columns: {
			handler(){
				this.updateLocalStorage('config');
			},
			deep: true
		},
	},
	mounted() {
		if( this.entities.length > 0 ) return;
		this.getEntities();
	}
}
</script>
<template>
	<div class="grid">

		<div class="grid--header d-print-none">
			<slot name="header" :search="getEntities" :response="response"></slot>
		</div>

		<Loader v-if="loading" :align="'center'" />

		<div :style="loading ? 'opacity: .3;' : ''">

			<div class="grid--toolbar row pt-4 align-items-center pb-2 d-print-none">
				<div class="col">
					<div class=" border py-2 px-3" v-if="bulkEdits && selected.length > 0">
						<form @submit="submitBulkEdits" class="d-flex align-items-center gap-2" ref="bulkEditForm">

							<template v-for="param in bulkEdits">
								<div class="">
									<label>{{ param.name }}:</label>
								</div>
								<div v-if="param.type === 'select'">
									<select class="form-select form-select-sm" :name="param.column">
										<option value="">-</option>
										<option v-for="option in param.options" :value="option.value">{{ option.title }}</option>
									</select>
								</div>
								<div v-if="param.type === 'date'">
									<input type="date" class="form-control form-control-sm" :name="param.column">
								</div>
							</template>

							<div>
								<span v-if="!confirmBulkEdit" class="btn btn-sm btn-outline-primary" @click="confirmBulkEdit = true">Update</span>
								<button v-else class="btn btn-sm btn-primary" :disabled="loading">Confirm Updating {{ selected.length }} Item(s)</button>
							</div>
						</form>
					</div>
				</div>
				<div class="col-4">
					<nav class="pb-2">
						<ul class="pagination justify-content-end mb-0">
							<li class="page-item">
								<button class="page-link" @click="getEntities(false)"><i class="bi bi-arrow-clockwise"></i></button>
							</li>

							<li class="page-item">
								<button class="page-link" @click="changePage(1)"><span aria-hidden="true">&laquo;</span></button>
							</li>

							<li v-for="index in pageCount" :class="getPageClasses(index)">
								<button class="page-link" @click="changePage(index)">{{ index }}</button>
							</li>

							<li class="page-item">
								<button class="page-link" @click="changePage(pageCount)"><span aria-hidden="true">&raquo;</span></button>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			<table class="table align-middle table-hover">
				<thead>
					<tr>
						<th v-if="bulkEdits" class="d-print-none"></th>
						<template v-for="(col, title) in columns">
						<th v-if="typeof col.active === 'undefined' || col.active === true" @click="orderBy(col.id)" :class="'text-nowrap ' + (col.align ? `text-${col.align}` : '')">
							{{ title }}
							<span v-if="col.id && searchState.order_by === col.id"><i :class="caretClasses"></i></span>
						</th>
						</template>
						<th style="width: 120px" class="d-print-none"></th>
					</tr>
				</thead>
				<tbody>
					<template v-for="item in entities">
						<tr class="quote-row" :class="getRowClasses(item)">
							<td v-if="bulkEdits" class="d-print-none"><input class="form-check-input p-2" type="checkbox" v-model="selected" :value="item.id"></td>
							<slot name="item" :item="item"></slot>
						</tr>
					</template>
				</tbody>
				<tfoot>
					<slot name="footer" :response="response"></slot>
				</tfoot>
			</table>

			<div class="grid--toolbar row pt-4 align-items-center pb-2 d-print-none">
				<div class="col">

				</div>
				<div class="col-4">
					<nav class="pb-2">
						<ul class="pagination justify-content-end mb-0">
							<li class="page-item">
								<button class="page-link" @click="getEntities(false)"><i class="bi bi-arrow-clockwise"></i></button>
							</li>

							<li class="page-item">
								<button class="page-link" @click="changePage(1)"><span aria-hidden="true">&laquo;</span></button>
							</li>

							<li v-for="index in pageCount" :class="getPageClasses(index)">
								<button class="page-link" @click="changePage(index)">{{ index }}</button>
							</li>

							<li class="page-item">
								<button class="page-link" @click="changePage(pageCount)"><span aria-hidden="true">&raquo;</span></button>
							</li>
						</ul>
					</nav>
				</div>
			</div>

		</div>

	</div>
</template>