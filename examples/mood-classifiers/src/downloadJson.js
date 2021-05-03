function downloadJson(jsonObj, fileName){
    const downElem = document.createElement('a');
    const dataStr = URL.createObjectURL(new Blob([JSON.stringify(jsonObj)], {type: 'application/json'}));
    downElem.setAttribute("href", dataStr);
    let nav = "";
    const separator = "-";
    const d = new Date();
    const date = d.toString().split(" GMT")[0].substring(4).replace(/ /gi, "-").replace(/:/gi, '_');
    if (window.navigator.userAgent.includes("Chrome")){
        nav = "Chrome";
    }
    else if (window.navigator.userAgent.includes("Firefox")){
        nav = "Firefox";
    }
    fileName = date.concat(separator.concat(nav.concat(separator.concat(fileName))));
    downElem.setAttribute("download", fileName);
    downElem.click();
}

export {downloadJson as default};