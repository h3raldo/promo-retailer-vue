<script setup>
import Loader from "@/components/globals/Loader.vue";
</script>
<script>
import utils from "@/js/utils.js";

export default {
	data(){
		return {
			loading: false,
			response: {},
			entities: [],
		}
	},
	props: ['columns', 'searchState', 'api'],
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
				console.log('current state', self.searchState);
			})
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
		},
		getPageClasses( page ) {
			return 'page-item' + (page === parseInt(this.searchState.page) ? ' active' : '');
		}
	},
	mounted() {
		console.log('api', this.api);
		if( this.entities.length > 0 ) return;
		this.getEntities()
	}
}
</script>
<template>
	<div class="grid">

		<slot name="header" :search="getEntities"></slot>

		<Loader v-if="loading" :align="'center'" />

		<div class="text-center pt-4">
			<nav>
				<ul class="pagination justify-content-center mb-0">
					<li class="page-item"><button class="page-link" @click="changePage(1)"><span aria-hidden="true">&laquo;</span></button></li>

					<li v-for="index in pageCount" :class="getPageClasses(index)">
						<button class="page-link" @click="changePage(index)">{{ index }}</button>
					</li>

					<li class="page-item"><button class="page-link" @click="changePage(pageCount)"><span aria-hidden="true">&raquo;</span></button></li>
				</ul>
			</nav>
		</div>

		<table class="table align-middle table-hover">
			<thead>
				<tr>
					<th v-for="(col, title) in columns" @click="orderBy(col.id)" class="text-nowrap">
						{{ title }}
						<span v-if="col.id && searchState.order_by === col.id"><i :class="caretClasses"></i></span>
					</th>
					<th style="width: 120px"></th>
				</tr>
			</thead>
			<tbody>
				<template v-for="item in entities">
					<slot name="item" :item="item"></slot>
				</template>
			</tbody>
			<tfoot>
				<slot name="footer" :response="response"></slot>
			</tfoot>
		</table>

	</div>
</template>