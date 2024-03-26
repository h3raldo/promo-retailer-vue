
<script>
export default {
	data(){
		return {
			group: '',
			items: [],
			compiling: false,
			refreshing: false,
			refreshingStatus: '',
			refreshingButtonText: 'Refresh Images'
		}
	},

	inject: ['alert'],

	methods: {
		refresh(){
			let refreshUrl = 'https://preview.promoretailer.dev/s3/imageCrawl/';
			let self = this;

			let refresher = {
				count: 0,
				calls: 0,
				items: [],
			}

			self.refreshing = true;
			sendRequests( '', onSuccess, onError)

			function onSuccess (count, calls){
				self.refreshingButtonText = 'Done!';
				setTimeout(()=> {
					self.refreshing = false;
					self.refreshingButtonText = 'Refresh Images';
				}, 2000)

				self.refreshingStatus = `DONE! Total calls: ${refresher.calls}. Total product variants refreshed: ${refresher.count}.`;
			}

			function onError( message ){
				self.refreshingButtonText = 'Error';
				self.refreshingStatus = message;
			}

			function sendRequests( marker, cb, ecb )
			{
				let url = refreshUrl + `?group=${self.group}&marker=${marker}`;

				fetch(url)
					.then(r => r.json())
					.then(d => {
						if( d.error === true ){
							ecb( d.message );
							return;
						}

						refresher.count += d.count;
						marker = d.marker;
						refresher.calls++;
						d.items.forEach( i => addItem(i));

						self.refreshingStatus = `Total calls: ${refresher.calls}. ${refresher.count} product variants refreshed...`;

						if( d.truncated ){
							sendRequests( marker, cb );
						} else{
							cb();
						}
					})
					.catch(e => {
						self.refreshing = false;
						self.alert('Error: ' + e.message, 'danger');
					})
			}

			function addItem(item)
			{
				let data = {
					group: item.group,
					color: item.color,
					images: [],
					missing: []
				};

				Object.keys(item).forEach( k => {
					let value = item[k];
					if( value === true ) data.images.push( k );
					if( value === false ) data.missing.push( k );
				})

				self.items.push(data)
			}
		},

		recompile(){
			let url = 'https://preview.promoretailer.dev/s3/images/recompile/';

			this.compiling = true;

			fetch(url)
				.then(r => r.json())
				.then(d => {
					this.compiling = false;
					console.log(d);
					if( d.error ) console.log(d);
					this.alert(d.message, 'success');
				})
				.catch(e => {
					this.compiling = false;
					this.alert('Error: ' + e.message, 'danger');
				})
		}
	}
}
</script>

<template>

	<h3>Update Images</h3>
	<hr>
	<div class="row">
		<div class="col-6">
			<label for="group" class="form-label">Group</label>

			<input type="text" class="form-control" v-model="group">

			<div class="form-text mb-3">Single Group SKU to refresh. Case-sensitive to match the folder in CDN</div>

			<button type="submit" class="btn btn-primary refresh-cache" :disabled="refreshing" @click="refresh">{{ refreshingButtonText }}</button>

			<div class="mt-4 p-3 bg-light" v-if="refreshingStatus">{{ refreshingStatus }}</div>

			<div class="mt-2 p-3 bg-light">
				<ul id="items">
					<li v-for="item in items">
						{{ item.group }} - {{ item.color }}
						<ul>
							<li v-for="image in item.images"><i class="bi bi-check-circle-fill text-primary"></i> {{ image }}</li>
							<li v-for="image in item.missing"><i class="bi bi-x-circle-fill text-danger"></i> {{ image }}</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
		<div class="col text-center pt-4">
			<br><br><br>
			<div class="form-text mb-3 px-4">AFTER you have refreshed all groups that need to be refreshed, you may update the images file. This re-compiles all images into one file.</div>
			<button type="submit" class="btn btn-success re-compile" @click="recompile" :disabled="compiling">Recompile Image File</button>
		</div>
	</div>

</template>