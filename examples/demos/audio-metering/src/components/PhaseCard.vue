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
// import paper from 'paper';

export default {
	props: {
		'leftCh': Float32Array,
		'rightCh': Float32Array,
		'correlation': Number
	},
	data () {
		return {
			chart: null,
			ctx: null
		}
	},
	mounted () {
		// drawPhaseGoniometer(this.leftCh, this.rightCh);
		this.ctx = this.$refs.lissajous.getContext('2d');
		drawPhaseNative(this.leftCh, this.rightCh, this.ctx);
	}
}

function drawPhaseNative (leftCh, rightCh, ctx) {
	console.info('drawing phase native');
	ctx.translate(100, 100);
	ctx.rotate(deg2rad(-135));
    
    let pastPoint = null;
	ctx.strokeStyle = '#F50E0003';
	ctx.lineWidth = 2;
    for (let s = 0; s < leftCh.length; s += 4) {
		ctx.beginPath();
        if (leftCh[s] == undefined || rightCh[s] == undefined) {
            console.log('reached end, no more points. s:', s);
            break;
        };
		
		// + 100 offset is redundant: ctx.translate 
		// applies to all subsequent objects in ctx
        const ls = (leftCh[s] * 100);
        const rs = (rightCh[s] * 100);

        let sampPoint = [ls, rs];
        // sampPoint = sampPoint.rotate(-135, translationPoint);
        if (s == 0) {
            // ctx.moveTo(sampPoint[0], sampPoint[1]);
            pastPoint = sampPoint.slice();
            continue;
        }
        // lissajousPath.add(sampPoint);
		ctx.moveTo(pastPoint[0], pastPoint[1]);
		ctx.lineTo(sampPoint[0], sampPoint[1]);
        // const segm = new paper.Path.Line(pastPoint, sampPoint);
        // segm.strokeColor = "#F50E0003";
        // segm.closed = true;
        // segm.smooth();
		// lissajousPath.add(segm);
        pastPoint = sampPoint.slice();
		ctx.stroke();
    }
	return 0;
}

function deg2rad (degrees) {
	return degrees * Math.PI / 180;
}

function drawPhaseGoniometer (leftCh, rightCh) {
    const axesColor = '#BBBBBB';

    const axisL = new paper.Path();
    axisL.strokeColor = axesColor;
    const leftstart = new paper.Point(0, 0);
    axisL.moveTo(leftstart);
    axisL.lineTo(leftstart + [ 200, 200 ]);
    axisL.closed = true;
    
    const axisR = new paper.Path();
    axisR.strokeColor = axesColor;
    const rightstart = new paper.Point(0, 200);
    axisR.moveTo(rightstart);
    axisR.lineTo(rightstart + [ 200, -200 ]);
    axisR.closed = true;
    
    const axisMid = new paper.Path();
    axisMid.strokeColor = axesColor;
    const midstart = new paper.Point(100, 200);
    axisMid.moveTo(midstart);
    axisMid.lineTo(midstart + [0, -180]);
    axisMid.closed = true;
    
    const textL = new paper.PointText([0, 27]);
    textL.fillColor = axesColor;
    textL.justification = "left";
    textL.content = "L";
    
    const textR = new paper.PointText([200, 27]);
    textR.fillColor = axesColor;
    textR.justification = "right";
    textR.content = "R";
    
    const textMid = new paper.PointText([100, 10]);
    textMid.fillColor = axesColor;
    textMid.justification = "center";
    textMid.content = "M";
    
    // const axesTranslationVector = new paper.Point([100, 100]);
    // axesTranslationVector.angle -= 135;
	const translationPoint = new paper.Point([100, 100]);
    
    let pastPoint = null;   
    const lissajousPath = new paper.Path();
    // lissajousPath.strokeColor = "#F50E0020";
    for (let s = 0; s < leftCh.length; s++) {
        if (leftCh[s] == undefined || rightCh[s] == undefined) {
            console.log('reached end, no more points. s:', s);
            break;
        };
        const ls = (leftCh[s] * 100) + 100;
        const rs = (rightCh[s] * 100) + 100;

        let sampPoint = new paper.Point([ls, rs]);
        sampPoint = sampPoint.rotate(-135, translationPoint);
        if (s == 0) {
            lissajousPath.moveTo(sampPoint);
            pastPoint = sampPoint.clone();
            continue;
        }
        // lissajousPath.add(sampPoint);

        const segm = new paper.Path.Line(pastPoint, sampPoint);
        segm.strokeColor = "#F50E0003";
        segm.closed = true;
        segm.smooth();
		lissajousPath.add(segm);
        pastPoint = sampPoint.clone();
    }
    lissajousPath.closed = true;
    lissajousPath.simplify(5);
	return 0;
}
</script>

<style>

</style>