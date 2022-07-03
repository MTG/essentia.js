<template>
	<v-card elevation="0" color="secondary lighten-3">
		<v-card-title>Phase Correlation</v-card-title>
        <v-card-subtitle>{{correlation.toFixed(3)}}</v-card-subtitle>
		<v-card-text>
            <div id="canvas-container">
                <canvas 
                    ref="axes"
                    id="axes"
                    height="200" 
                    width="200"
                ></canvas>
                <canvas 
                    ref="lissajous"
                    id="lissajous"
                    height="200" 
                    width="200"
                ></canvas>
            </div>
		</v-card-text>
	</v-card>
</template>

<script>
function deg2rad (degrees) {
	return degrees * Math.PI / 180;
}
const ALPHAS = ['10', '07', '05', '03', '01'];
const sampleSkip = 256;

export default {
	props: {
		'leftCh': Float32Array,
		'rightCh': Float32Array,
		'correlation': Number,
        refTrack: {
            default: undefined,
            required: true
        }
	},
	data () {
		return {
			lissajousCtx: null,
            axesCtx: null,
            animationFrame: 0,
            variation: 0,
            variationMemo: Array(5).fill(0)
		}
	},
	mounted () {
        console.info('drawing phase native');
        console.time('draw-phase');
        this.axesCtx = this.$refs.axes.getContext('2d');
		this.lissajousCtx = this.$refs.lissajous.getContext('2d');

		this.drawAxes();
        // this.animationFrame = requestAnimationFrame(this.drawPhase.bind(this));
        this.drawPhase();
        console.timeEnd('draw-phase');
	},
    methods: {
        drawPhase () {
            const ctx = this.lissajousCtx;
            ctx.clearRect(0, 0, 200, 200);
            ctx.save();

            ctx.translate(100, 100);
            ctx.rotate(deg2rad(-135));
            ctx.lineWidth = 2;

            // this.variationMemo.map( (v, i) => {
            //     this.drawVariation(v, ALPHAS[i])
            // });
            this.drawVariation(0, '13');

            this.variationMemo.pop();
            this.variationMemo.unshift(this.variation);
            this.variation++;
            this.variation %= sampleSkip;
            ctx.restore();
            // requestAnimationFrame(this.drawPhase.bind(this));
        },
        drawAxes () {
            const ctx = this.axesCtx;
            const axesColor = '#BBBBBB';

            ctx.strokeStyle = axesColor;
            ctx.lineWidth = 2;
            ctx.fillStyle = axesColor;
            ctx.font = 'bold 12px sans-serif';

            ctx.beginPath();

            ctx.moveTo(0, 0) // left axis
            ctx.lineTo(200, 200);
            ctx.textAlign = "left";
            ctx.fillText("L", 0, 27);
            
            ctx.moveTo(0, 200); // right axis
            ctx.lineTo(200, 0);
            ctx.textAlign = "right";
            ctx.fillText("R", 200, 27);
            
            ctx.moveTo(100, 200); // middle axis
            ctx.lineTo(100, 20);
            ctx.textAlign = "center";
            ctx.fillText("M", 100, 10);

            ctx.font = 'bold 20px sans-serif';
            ctx.fillStyle = '#F50E0040';
            ctx.textAlign = "left";
            ctx.fillText("+", 20, 12);
            ctx.textAlign = "right";
            ctx.fillText("‒", 200, 180);
            ctx.textAlign = "right";
            ctx.fillText("+", 180, 12);
            ctx.textAlign = "left";
            ctx.fillText("‒", 0, 180);

            ctx.stroke();
        },
        drawVariation (variation, alpha) {
            const ctx = this.lissajousCtx;
            ctx.strokeStyle = `#F50E00${alpha}`;
            let pastPoint = null;
            for (let s = 0; s < this.leftCh.length; s+=sampleSkip) {
                ctx.beginPath();
                const leftSample = this.leftCh[s+variation];
                const rightSample = this.rightCh[s+variation];
                if (leftSample == undefined || rightSample == undefined) {
                    break;
                };
                
                // + 100 offset is redundant: ctx.translate 
                // applies to all subsequent objects in ctx
                const ls = (leftSample * 60);
                const rs = (rightSample * 60);
                let sampPoint = [ls, rs];
                if (s == 0) {
                    ctx.moveTo(sampPoint[0], sampPoint[1]);
                    pastPoint = sampPoint.slice();
                    continue;
                }
                ctx.moveTo(pastPoint[0], pastPoint[1]);
                ctx.lineTo(sampPoint[0], sampPoint[1]);
                pastPoint = sampPoint.slice();
                ctx.stroke();
            }
        }
    }
}

</script>

<style>
    #canvas-container {
        position: relative;
        padding: 0;
        margin: 0;
    }

    #axes {
        z-index: 1;
    }
    #lissajous {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
    }
</style>