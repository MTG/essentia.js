function URLFromFiles(files) {
    const promises = files
        .map((file) => fetch(file)
            .then((response) => response.text()));

    return Promise
        .all(promises)
        .then((texts) => {
            const text = texts.join('');
            const blob = new Blob([text], {type: "application/javascript"});

            return URL.createObjectURL(blob);
        });
}

export { URLFromFiles }