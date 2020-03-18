
// default plot config for EssentiaPlot base class
let PlotConfig = {
  isPlotting: false,
  startTimeIndex: 0 
}

// default layout settings for melody contour plots
let LayoutMelodyContour = {
  title: "Melody Contour",
  plot_bgcolor: "transparent",
  paper_bgcolor:"#FCF7F7",
  autosize: false,
  width: 645,
  height: 295,
  xaxis: {
    type: "time",
    title: "Time"
  },
  yaxis: {
    autorange: false,
    range: [0, 1500],
    type: "linear",
    title: "Frequency (Hz)"
  }
}

/**
 * @class Base class for essentia plot
 */
class EssentiaPlot {

  isPlotting: boolean;
  startTimeIndex: number;
  /**
   *Creates an instance of EssentiaPlot.
  * @param {*} Plotly 
  * @param {*} [options=CONFIG]
  * @memberof EssentiaPlot
  */
  constructor(public Plotly: any, public options: any = PlotConfig) {
    this.isPlotting = options.isPlotting;
    this.startTimeIndex = options.startTimeIndex;
  }

  /**
   * Return evenly spaced numbers over a specified interval
   * Returns num evenly spaced samples, calculated over the interval [start, stop].
   * @param {*} start The starting value of the sequence.
   * @param {*} stop The end value of the sequence
   * @param {*} num Number of samples to generate. Must be non-negative
   * @returns
   * @memberof EssentiaPlot
   */
  makeLinearSpace(start:any, stop:any, num:any) {
    if(typeof num === "undefined") num = Math.max(Math.round(stop-start)+1,1);
    if(num<2) { return num===1?[start]:[]; }
    var i,ret = Array(num);
    num--;
    for(i=num;i>=0;i--) { ret[i] = (i*stop+(num-i)*start)/num; }
    return ret;
  }

}

/**
 * @class PlotMelodyContour
 * @extends {EssentiaPlot}
 */
class PlotMelodyContour extends EssentiaPlot {
  
  /**
   *Creates an instance of PlotMelodyContour.
   * @param {string} divId
   * @param {*} [plotLayout=LayoutMelodyContour]
   * @memberof PlotMelodyContour
   */
  constructor(public Plotly: any,
              public divId: string, 
              public plotLayout: any = LayoutMelodyContour) {
    super(Plotly);
  }

  /**
   * Create the plot given inputs
   * @method
   * @param {Float32Array} featureArray
   * @param {string} plotTitle
   * @param {number} audioFrameSize
   * @param {number} audioSampleRate
   * @memberof PlotMelodyContour
   */
  create(featureArray: Float32Array,  
      plotTitle: string,
      audioFrameSize: any, 
      audioSampleRate: any,) {
    
    this.plotLayout.title = plotTitle;

    // time axis
    let timeAxis = this.makeLinearSpace(this.startTimeIndex, 
                                        audioFrameSize / audioSampleRate, 
                                        featureArray.length);
    
    // Create a plotly plot instance if a plot hasn't been created before
    if (!this.isPlotting) {
      this.Plotly.newPlot(this.divId, [{
        x: timeAxis,
        y: featureArray,
        mode: 'lines',
        line: { color: '#2B6FAC', width: 2 }
      }], this.plotLayout);
                                    
      this.isPlotting = true;
      this.startTimeIndex = timeAxis[timeAxis.length-1];
                                    
    } else {
      timeAxis = this.makeLinearSpace(this.startTimeIndex,
                                      this.startTimeIndex + (audioFrameSize / audioSampleRate), 
                                      featureArray.length);
      
      this.startTimeIndex = timeAxis[timeAxis.length-1];
                                   
      this.Plotly.extendTraces(this.divId, {
                                  x: [timeAxis],
                                  y: [featureArray],
                                }, [0]);
    }
  }

  /**
   * Remove the existing Plotly plot  
   * @method
   * @memberof PlotMelodyContour
   */
  destroy() {
    this.Plotly.deleteTraces(this.divId, 0);  
    this.isPlotting = false;
    this.startTimeIndex = 0;
  }
}


export { EssentiaPlot, PlotMelodyContour, LayoutMelodyContour, PlotConfig };