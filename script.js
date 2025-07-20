let editIndex = null;

const GOOGLE_SHORTCUTS = [
  { name: "Gmail",   url: "https://mail.google.com" },
  { name: "YouTube", url: "https://www.youtube.com" },
  { name: "Drive",   url: "https://drive.google.com" }
];

const modal      = document.getElementById("modal");
const titleEl    = document.getElementById("modal-title");
const nameIn     = document.getElementById("modal-name");
const urlIn      = document.getElementById("modal-url");
const actionBtn  = document.getElementById("modal-action");
const deleteBtn  = document.getElementById("modal-delete");
const openAddBtn = document.getElementById("open-add");
const closeBtn   = document.querySelector(".close");

function createLink(name, url) {
  const a = document.createElement("a");
  a.href = url;
  a.title = name;
  return a;
}

function getFavicon(url) {
  try {
    const host = new URL(url).hostname;
    if (host.includes("mail.google.com"))
      return "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico";
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return "";
  }
}

function renderGoogle() {
  const ul = document.getElementById("google-list");
  ul.innerHTML = "";
  GOOGLE_SHORTCUTS.forEach(({ name, url }) => {
    const li = document.createElement("li");
    const a  = createLink(name, url);
    const img = document.createElement("img");
    img.src = getFavicon(url);
    img.alt = name;
    a.append(img, document.createTextNode(name));
    li.appendChild(a);
    ul.appendChild(li);
  });
}

function loadCustom() {
  return JSON.parse(localStorage.getItem("customShortcuts")||"[]");
}
function saveCustom(arr) {
  localStorage.setItem("customShortcuts", JSON.stringify(arr));
}

function renderCustom() {
  const ul = document.getElementById("custom-list");
  ul.innerHTML = "";
  loadCustom().forEach(({ name, url }, i) => {
    const li = document.createElement("li");
    const a  = createLink(name, url);
    const img = document.createElement("img");
    img.src = getFavicon(url);
    img.alt = name;
    a.append(img, document.createTextNode(name));

    const actions = document.createElement("div");
    actions.className = "actions";

    const menuBtn = document.createElement("button");
    menuBtn.className = "menu-btn";
    menuBtn.textContent = "⋮";
    menuBtn.onclick = e => {
      e.stopPropagation();
      openEdit(i);
    };

    const delBtn = document.createElement("button");
    delBtn.className = "del-btn";
    delBtn.textContent = "🗑";
    delBtn.onclick = e => {
      e.stopPropagation();
      const arr = loadCustom();
      arr.splice(i,1);
      saveCustom(arr);
      renderCustom();
    };

    actions.append(menuBtn, delBtn);
    li.append(a, actions);
    ul.appendChild(li);
  });
}

function openAdd() {
  editIndex = null;
  titleEl.textContent = "Add Shortcut";
  actionBtn.textContent = "Add";
  deleteBtn.classList.add("hidden");
  nameIn.value = "";
  urlIn.value = "";
  modal.classList.remove("hidden");
}

function openEdit(idx) {
  editIndex = idx;
  const arr = loadCustom();
  titleEl.textContent = "Edit Shortcut";
  actionBtn.textContent = "Save";
  deleteBtn.classList.remove("hidden");
  nameIn.value = arr[idx].name;
  urlIn.value  = arr[idx].url;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function handleAction() {
  const name = nameIn.value.trim();
  const url  = urlIn.value.trim();
  if (!name||!url) return;
  const arr = loadCustom();
  if (editIndex===null) arr.push({name,url});
  else arr[editIndex]={name,url};
  saveCustom(arr);
  renderCustom();
  closeModal();
}

function handleDelete() {
  if (editIndex===null) return;
  const arr = loadCustom();
  arr.splice(editIndex,1);
  saveCustom(arr);
  renderCustom();
  closeModal();
}

openAddBtn.addEventListener("click", openAdd);
closeBtn.addEventListener("click", closeModal);
actionBtn.addEventListener("click", handleAction);
deleteBtn.addEventListener("click", handleDelete);

document.addEventListener("DOMContentLoaded",()=>{
  renderGoogle();
  renderCustom();
});
