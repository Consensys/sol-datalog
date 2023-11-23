function findElement(selector) {
    const element = document.querySelector(selector);

    if (element === null) {
        throw new Error(`Unable to find element with selector "${selector}"`);
    }

    return element;
}

async function updateMeta() {
    const preMeta = findElement(".meta pre");

    preMeta.innerHTML = "... loading ...";

    const data = await fetch("/meta").then((response) => response.json());

    preMeta.innerHTML = JSON.stringify(data, undefined, 4);
}

async function queryClickHandler() {
    const txtInput = findElement("textarea.input");
    const query = txtInput.value;

    const data = await fetch("/query", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ query })
    }).then((response) => response.json());

    const preOutput = findElement("pre.output");

    preOutput.innerHTML = "error" in data ? data.error : JSON.stringify(data, undefined, 4);
}

async function refreshMetaClickHandler() {
    await updateMeta();
}

async function loadHandler() {
    findElement("button.query").addEventListener("click", queryClickHandler);

    findElement("button.refresh-meta").addEventListener("click", refreshMetaClickHandler);

    await refreshMetaClickHandler();
}

window.addEventListener("load", loadHandler);
