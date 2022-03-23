<template>
	<v-card elevation="0" color="secondary lighten-3">
		<v-card-title>Phase Correlation</v-card-title>

		<v-card-text>
			<!-- <svg id="phase-goniometer"></svg> -->
			<canvas 
				ref="lissajous" 
				resize="true" 
				height="200" 
				width="200"
			></canvas>
		</v-card-text>
	</v-card>
</template>

<script>
function deg2rad (degrees) {
	return degrees * Math.PI / 180;
}

export default {
	props: {
		'leftCh': Float32Array,
		'rightCh': Float32Array,
		'correlation': Number
	},
	data () {
		return {
			ctx: null
		}
	},
	mounted () {
		// drawPhaseGoniometer(this.leftCh, this.rightCh);
		this.ctx = this.$refs.lissajous.getContext('2d');
        console.info('drawing phase native');
        this.drawAxes();
		this.drawPhase();
	},
    methods: {
        drawPhase () {
            this.ctx.translate(100, 100);
            this.ctx.rotate(deg2rad(-135));
            
            let pastPoint = null;
            this.ctx.strokeStyle = '#F50E0003';
            this.ctx.lineWidth = 2;
            for (let s = 0; s < this.leftCh.length; s++) {
                this.ctx.beginPath();
                if (this.leftCh[s] == undefined || this.rightCh[s] == undefined) {
                    console.log('reached end, no more points. s:', s);
                    break;
                };
                
                // + 100 offset is redundant: ctx.translate 
                // applies to all subsequent objects in ctx
                const ls = (this.leftCh[s] * 100);
                const rs = (this.rightCh[s] * 100);
                let sampPoint = [ls, rs];
                if (s == 0) {
                    this.ctx.moveTo(sampPoint[0], sampPoint[1]);
                    pastPoint = sampPoint.slice();
                    continue;
                }
                this.ctx.moveTo(pastPoint[0], pastPoint[1]);
                this.ctx.lineTo(sampPoint[0], sampPoint[1]);
                pastPoint = sampPoint.slice();
                this.ctx.stroke();
            }
        },
        drawAxes () {
            const axesColor = '#BBBBBB';

            this.ctx.strokeStyle = axesColor;
            this.ctx.lineWidth = 2;
            this.ctx.fillStyle = axesColor;
            this.ctx.font = 'bold 12px sans-serif';

            this.ctx.beginPath();

            this.ctx.moveTo(0, 0) // left axis
            this.ctx.lineTo(200, 200);
            this.ctx.textAlign = "left";
            this.ctx.fillText("L", 0, 27);
            
            this.ctx.moveTo(0, 200); // right axis
            this.ctx.lineTo(200, 0);
            this.ctx.textAlign = "right";
            this.ctx.fillText("R", 200, 27);
            
            this.ctx.moveTo(100, 200); // middle axis
            this.ctx.lineTo(100, 20);
            this.ctx.textAlign = "center";
            this.ctx.fillText("M", 100, 10);

            this.ctx.stroke();
        }
    }
}

</script>

<style>

</style>