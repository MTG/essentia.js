<template>
  <v-card elevation="0" color="secondary lighten-3">
    <v-card-title>Phase Correlation</v-card-title>
    <v-card-text class="d-flex justify-space-between">
		<div class="d-flex flex-column justify-center">
            <p class="text-center error--text">{{correlation.toFixed(3)}}</p>
            <div class="canvas-container">
                <canvas
                    ref="axes"
                    class="axes"
                    height="200"
                    width="200"
                ></canvas>
                <canvas
                    ref="lissajous"
                    class="lissajous"
                    height="200"
                    width="200"
                ></canvas>
            </div>
        </div>
        <div class="d-flex flex-column justify-center" v-if="refTrack !== undefined">
            <p class="text-center primary--text">{{refTrack.phase.correlation.toFixed(3)}}</p>
            <div class="canvas-container">
                <canvas
                    ref="refAxes"
                    class="axes"
                    height="200"
                    width="200"
                ></canvas>
                <canvas
                    ref="refLissajous"
                    class="lissajous"
                    height="200"
                    width="200"
                ></canvas>
            </div>
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
		leftCh: Float32Array,
		rightCh: Float32Array,
		correlation: Number,
		refTrack: {
			default: undefined,
			required: true
		},
		strokeColor: String
	},
	data () {
		return {
			animationFrame: 0,
			variation: 0,
			variationMemo: Array(5).fill(0)
		}
	},
    watch: {
        refTrack(newVal) {
            if (newVal !== undefined) {
                this.$nextTick(() => {
                    this.drawRef(this.$root.$vuetify.theme.themes.light.primary);
					// this.drawMain(this.$root.$vuetify.theme.themes.light.accent);
                })
            }
        }
    },
	mounted () {
		// console.info('drawing phase native');
		// console.time('draw-phase'); '#F50E00'
		this.drawMain(this.$root.$vuetify.theme.themes.light.error);
		// console.timeEnd('draw-phase');
	},
    methods: {
        drawPhase (data, ctx, color) {
            ctx.clearRect(0, 0, 200, 200);
            ctx.save();

            ctx.translate(100, 100);
            ctx.rotate(deg2rad(-135));
            ctx.lineWidth = 2;

            // this.variationMemo.map( (v, i) => {
            //     this.drawVariation(v, ALPHAS[i])
            // });
            this.drawVariation(data, 0, color, '10', ctx);

            this.variationMemo.pop();
            this.variationMemo.unshift(this.variation);
            this.variation++;
            this.variation %= sampleSkip;
            ctx.restore();
            // requestAnimationFrame(this.drawPhase.bind(this));
        },
        drawAxes (ctx, signsColor) {
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
            ctx.fillStyle = `${signsColor}80`;
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
        drawVariation (data, variation, phaseColor, alpha, ctx) {
            const leftCh = data[0];
            const rightCh = data[1];
            ctx.strokeStyle = `${phaseColor}${alpha}`;
            let pastPoint = null;
            for (let s = 0; s < leftCh.length; s+=sampleSkip) {
                ctx.beginPath();
                const leftSample = leftCh[s+variation];
                const rightSample = rightCh[s+variation];
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
        },
		drawMain(color) {
			const axesCtx = this.$refs.axes.getContext('2d');
			const lissajousCtx = this.$refs.lissajous.getContext('2d');

			this.drawAxes(axesCtx, color);
			// this.animationFrame = requestAnimationFrame(this.drawPhase.bind(this));
			this.drawPhase([this.leftCh, this.rightCh],lissajousCtx, color);
		},
		drawRef(color) {
			const refAxesCtx = this.$refs.refAxes.getContext('2d');
			const refLissajousCtx = this.$refs.refLissajous.getContext('2d');

			this.drawAxes(refAxesCtx, color);
			// this.animationFrame = requestAnimationFrame(this.drawPhase.bind(this));
			this.drawPhase(this.refTrack.phase.channelData, refLissajousCtx, color);
		}
    }
}

</script>

<style scoped>
    .canvas-container {
        position: relative;
        padding: 0;
        margin: 0;
    }

    .axes {
        z-index: 1;
    }
    .lissajous {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 2;
    }
</style>