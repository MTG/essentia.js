<template>
	<div>
		<main>
			<YTStream></YTStream>
			<PredictionsDisplay></PredictionsDisplay>
		</main>
		<DemosFooter></DemosFooter>
	</div>
</template>

<script>
import YTStream from './components/YTStream.vue';
import PredictionsDisplay from './components/PredictionsDisplay.vue';
import DemosFooter from './components/DemosFooter.vue';

export default {
    components: { YTStream, PredictionsDisplay, DemosFooter }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

* {
	box-sizing: border-box;
	--color-bg: 25, 25, 25;
	--border-radius: 5px;
	--color-primary: 242, 242, 242;
	--color-grey: 117, 117, 117;
	--action-color: #19ee9c;
	--btn-shadow: 0 2px 4px black;
	font-family: 'Montserrat', sans-serif;
}

#app {
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	/* color: #2c3e50; */
}

main {
	display: flex;
	flex-direction: row;
	justify-content: center;
	height: 100vh;
}

body {
	background-color: rgb(var(--color-bg));
	color: white;
	margin: 0;
}
</style>
