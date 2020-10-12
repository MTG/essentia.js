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
      title: 'Pitch class',
      range: [0, 11]
  },
};


// default layout settings for spectrogram heatmap plot
let LayoutSpectrogramPlot = {
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
 * Base class for essentia.js-plot*
 * @class 
 */
class EssentiaPlot {

  public isPlotting: boolean;
  public startTimeIndex: number;
  /**
   *Creates an instance of EssentiaPlot.
  * @param {*} Plotly plotly.js global import object (see https://plotly.com/javascript/)
  * @param {*} [options=CONFIG] config options for the plot
  * @constructs
  */
  constructor(public Plotly: any, public options: any = PlotConfig) {
    this.isPlotting = options.isPlotting;
    this.startTimeIndex = options.startTimeIndex;
  }

  /**
   * Returns evenly spaced samples, calculated over the interval [start, stop].
   * @param {*} start The starting value of the sequence.
   * @param {*} stop The end value of the sequence
   * @param {*} num Number of samples to generate. Must be non-negative.
   * @returns {Array}
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
   * Creates an instance of PlotMelodyContour
   * @param {*} Plotly plotly.js global object import (see https://plotly.com/javascript/)
   * @param {string} divId HTML div container id
   * @param {*} [plotLayout=LayoutMelodyContour]
   * @constructs
   */
  constructor(public Plotly: any,
              public divId: string,
              public plotLayout: any = LayoutMelodyContourPlot) {
    super(Plotly);
  }

  /**
   * Create the single line plot with the given input array using Plotly.js
   * @method
   * @param {Float32Array} featureArray 1D feature input array
   * @param {string} plotTitle title of the plot
   * @param {number} audioFrameSize length of input audio data in samples
   * @param {number} audioSampleRate sample rate of input audio 
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
   * Destroy the existing Plotly traces  
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
  
  public yAxis: any;

  /**
   *Creates an instance of PlotHeatmap
  * @param {*} Plotly plotly.js global object import (see https://plotly.com/javascript/)
  * @param {string} divId HTML div container id
  * @param {string} [plotType='chroma'] type of plot to configure the y-axis
  * @param {*} [plotLayout=LayoutSpectrogramPlot]
  * @constructs
  */
  constructor(public Plotly: any, 
              public divId: string, 
              public plotType: string="chroma",
              public plotLayout: any=LayoutSpectrogramPlot) {

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
   * @param {Array} featureArray 2D feature array where 'x' axis denotes temporal evolution of features
   * @param {string} plotTitle title of the plot
   * @param {*} audioFrameSize length of input audio data in samples
   * @param {*} audioSampleRate sample rate of input audio
   * @param {*} [hopSize=0] hopSize used for the feture extraction if applies.
   * @param {string} [colorscale='Jet']
   * @memberof PlotHeatmap
   */
  create(featureArray: any,  
        plotTitle: string,
        audioFrameSize: number, 
        audioSampleRate: number,
        hopSize: number,
        colorscale: string='Jet',) {

    this.plotLayout.title = plotTitle;

    if (this.plotType === "spectrogram") {
      let numBands = featureArray[0].length;
      this.plotLayout.yaxis.range = [0, numBands + 1];
    } 
     
    if (!this.isPlotting) {

      let heatmapFeature;
      let timeAxis;

      if ((featureArray[0].constructor === Array) || (featureArray[0].constructor === Float32Array)) {
        if (featureArray.length == 1) {
          heatmapFeature = featureArray;
          timeAxis = [this.startTimeIndex + hopSize/audioSampleRate, this.startTimeIndex + audioFrameSize / audioSampleRate];
        } else {
          heatmapFeature = featureArray;
          timeAxis = this.makeLinearSpace(this.startTimeIndex, audioFrameSize / audioSampleRate, heatmapFeature.length);
        } 
      } else {
        throw "Got 1D array as input, expect a 2D array..."
      }
       
      let data = {
        x: timeAxis,
        y: this.yAxis,
        z: heatmapFeature,
        colorscale: colorscale,
        type: 'heatmap',
        transpose: true,
      };
      this.Plotly.newPlot(this.divId, [data], this.plotLayout);
      this.isPlotting = true;
      this.startTimeIndex = timeAxis[timeAxis.length-1];
    } else {
      // realtime mode
      let heatmapFeature;
      let timeAxis;

      if ((featureArray[0].constructor === Array) || (featureArray[0].constructor === Float32Array)) {
        if (featureArray.length == 1) {
          heatmapFeature = featureArray;
          timeAxis = [this.startTimeIndex + hopSize/audioSampleRate, this.startTimeIndex + audioFrameSize / audioSampleRate];
        } else {
          heatmapFeature = featureArray;
          timeAxis = this.makeLinearSpace(this.startTimeIndex, audioFrameSize / audioSampleRate, heatmapFeature.length);
        }
      } else {
        throw "Got 1D array as input, expect a 2D array..."
      }
    
      this.startTimeIndex = timeAxis[timeAxis.length-1]; 
      // realtime mode  
      this.Plotly.extendTraces(this.divId, {
          x: [timeAxis],
          z: [featureArray],
      }, [0]);
    }
  }

  /**
   * Destroy the existing Plotly plot traces 
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
