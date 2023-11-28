function findElement(selector) {
    const element = document.querySelector(selector);

    if (element === null) {
        throw new Error(`Unable to find element with selector "${selector}"`);
    }

    return element;
}

function findElements(selector) {
    return document.querySelectorAll(selector);
}

function handleMenuSwitch(currentLink) {
    const containers = findElements("div.container");

    const targetId = currentLink.dataset["target"];

    if (targetId === undefined) {
        throw new Error("Target is undefined for clicked link");
    }

    containers.forEach((container) => {
        container.style.display = container.id === targetId ? "" : "none";
    });

    const navLinks = findElements(".navbar a");

    navLinks.forEach((navLink) => {
        if (navLink === currentLink) {
            navLink.classList.add("current");
        } else {
            navLink.classList.remove("current");
        }
    });
}

async function updateMeta() {
    const preMeta = findElement(".meta pre");

    preMeta.innerHTML = "\n... loading ...\n";

    const data = await fetch("/meta").then((response) => response.json());

    preMeta.innerHTML = JSON.stringify(data, undefined, 4);
}

async function updateDatalog() {
    const preOut = findElement("#datalog pre.output");

    preOut.innerHTML = "\n... loading ...\n";

    const data = await fetch("/datalog").then((response) => response.json());

    preOut.innerHTML = data.datalog;
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

    const preOut = findElement("#query pre.output");

    preOut.innerHTML = "error" in data ? data.error : JSON.stringify(data, undefined, 4);
}

async function refreshMetaClickHandler() {
    await updateMeta();
}

async function refreshDatalogClickHandler() {
    await updateDatalog();
}

async function loadHandler() {
    findElement("button.query").addEventListener("click", queryClickHandler);

    findElement("button.refresh-meta").addEventListener("click", refreshMetaClickHandler);

    findElement("button.refresh-dl").addEventListener("click", refreshDatalogClickHandler);

    const navLinks = findElements(".navbar a");

    navLinks.forEach((navLink) =>
        navLink.addEventListener("click", () => handleMenuSwitch(navLink))
    );

    navLinks.item(0).click();

    await Promise.all([refreshMetaClickHandler(), refreshDatalogClickHandler()]);
}

window.addEventListener("load", loadHandler);
