/*
 * Copyright (C) 2006-2020  Music Technology Group - Universitat Pompeu Fabra
 *
 * This file is part of Essentia
 *
 * Essentia is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation (FSF), either version 3 of the License, or (at your
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the Affero GNU General Public License
 * version 3 along with this program.  If not, see http://www.gnu.org/licenses/
 */

// default plot config for EssentiaPlot base class
let PlotConfig = {
  isPlotting: false,
  startTimeIndex: 0 
}

// default layout settings for melody contour plots
let LayoutMelodyContourPlot = {
  title: "Melody Contour",
  plot_bgcolor: "transparent",
  paper_bgcolor:"#FCF7F7",
  autosize: false,
  width: 670,
  height: 300,
  xaxis: {
    type: "time",
    title: "Time"
  },
  yaxis: {
    autorange: false,
    range: [30, 3000],
    type: "linear",
    title: "Frequency (Hz)"
  }
}


// default layout settings for chroma heatmap plot
let LayoutChromaPlot = {
  title: "",
  plot_bgcolor: "transparent",
  paper_bgcolor:"#FCF7F7",
  autosize: false,
  width: 670,
  height: 300,
  xaxis: {
      autorange: true,
      time: 'Time',
      title: 'Time'
  },
  yaxis: {
      title: 'Chroma Bins',
      range: [0, 11]
  },
};


// default layout settings for spectrogram heatmap plot
var LayoutSpectrogramPlot = {
  title: "",
  plot_bgcolor: "transparent",
  paper_bgcolor:"#FCF7F7",
  autosize: false,
  width: 670,
  height: 300,
  xaxis: {
      title: 'Time',
      autorange: true,
      time: 'Time',
  },
  yaxis: {
      title: 'Bands',
      range: null,
      type: 'linear',
  },
};

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
              public plotLayout: any = LayoutMelodyContourPlot) {
    super(Plotly);
  }

  /**
   * Create the melody contour plot given inputs using Plotly.js
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


/**
 * @class PlotHeatmap
 * @extends {EssentiaPlot}
 */
class PlotHeatmap extends EssentiaPlot {
  yAxis: any;
  /**
   *Creates an instance of PlotHeatmap.
  * @param {*} Plotly
  * @param {string} divId
  * @param {string} [plotType='chroma']
  * @param {*} [plotLayout=LayoutChromaHeatmap]
  * @memberof PlotHeatmap
  */
  constructor(public Plotly: any, public divId: string, public plotType: string="chroma", public plotLayout: any) {
    super(Plotly);
    if (plotType === "chroma") {
      // we set chroma bin labels as yAxis for the heatmap
      this.yAxis = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    } else if (plotType === "spectrogram") {
      this.yAxis = null;
    } else {
      throw "Invalid value for argument 'plotType'. Should be either 'chroma' or 'spectrogram'";
    }
  }

  /**
   * Create Plotly.js heatmap plot with given input array and type
   * @param {Array} featureArray
   * @param {string} plotTitle
   * @param {*} audioFrameSize
   * @param {*} audioSampleRate
   * @param {string} [colorscale='Jet']
   * @memberof PlotChromaHeatmap
   */
  create(featureArray: any,  
        plotTitle: string,
        audioFrameSize: any, 
        audioSampleRate: any,
        colorscale: string='Jet',) {

    this.plotLayout.title = plotTitle;

    if (this.plotType === "spectrogram") {
      let numBands = featureArray[0].length;
      this.plotLayout.yaxis.range = [0, numBands + 1];
    } 
     
    let timeAxis = this.makeLinearSpace(this.startTimeIndex, 
                                      audioFrameSize / audioSampleRate, 
                                      featureArray.length);
    let data = {
        x: timeAxis,
        y: this.yAxis,
        z: featureArray,
        colorscale: colorscale,
        type: 'heatmap',
        transpose: true,
    };
    if (!this.isPlotting) {
        this.Plotly.newPlot(this.divId, [data], this.plotLayout)
        this.startTimeIndex = timeAxis[timeAxis.length-1];
    } else {
      timeAxis = this.makeLinearSpace(this.startTimeIndex,
                                  this.startTimeIndex + (audioFrameSize / audioSampleRate), 
                                  featureArray.length);
      this.startTimeIndex = timeAxis[timeAxis.length-1];   
      this.Plotly.extendTraces(this.divId, {
          x: [timeAxis],
          z: [featureArray],
      }, [0]);
    }
  }
  /**
   * Remove the existing Plotly plot  
   * @method
   * @memberof PlotHeatmap
   */
  destroy() {
    this.Plotly.deleteTraces(this.divId, 0);  
    this.isPlotting = false;
    this.startTimeIndex = 0;
  }
}


// export the classes
export { 
  EssentiaPlot, 
  PlotMelodyContour, 
  PlotHeatmap,
  // layout setings 
  LayoutMelodyContourPlot, 
  LayoutChromaPlot,
  LayoutSpectrogramPlot, 
  PlotConfig 
};
