<template>
  <div id="input-method-select">
		<button 
			class="search-control method-control" 
			:class="{'move-right': selected != 'youtube', 'control-is-active': selected == 'youtube'}" 
			id="method-youtube"
			@click="selected = 'youtube'"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
				<path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
				<path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
			</svg>
			Youtube URL 
		</button>
		<button 
			class="search-control method-control"
			:class="{'control-is-active': selected == 'file'}"
			id="method-file"
			@click="selected = 'file'"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="btn-icon" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
				<path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
				<path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
			</svg>
			File upload 
		</button>
	</div>
</template>

<script>
export default {
	data () {
		return {
			selected: 'youtube'
		}
	},
	watch: {
		selected (newVal, _) {
			this.$emit('change', newVal);
		}
	}
}
</script>

<style lang="scss">
	#input-method-select {
		display: flex;
		width: 100%;
		background-color: rgba(var(--color-primary), 0.5);
		border-radius: var(--border-radius);
	}

	.method-control {
		background-color: transparent;
		position: relative;
		z-index: 0;
		color: black;
		display: flex;
		box-shadow: none;
		&:first-of-type:after {
			width: 100%;
			height: 100%;
			position: absolute;
			z-index: -10;
			content: "";
			transform: translateX(0);
			transition: transform .3s ease-in-out;
			background-color: white;
			top: 0;
			left: 0;
			border-radius: var(--border-radius);
			border-bottom-color: var(--action-color);
			border-bottom-style: solid;
			border-bottom-width: .25rem;
			box-shadow: var(--btn-shadow);
		}
	}

	#method-youtube.move-right:after {
		transform: translateX(100%);
	}

	.btn-icon {
		margin: auto .5rem;
	}
</style>