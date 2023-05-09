const API_URL = "https://url-shortener-node-yw4h.onrender.com"

function copy(target) {
    // Element to selected
    let copyText = target.closest(".shorten-url").children[0].innerText;
    navigator.clipboard.writeText(copyText);
  }
  
  document.addEventListener("click", (e) => {
    if (e.target.matches("i.fa-regular.fa-copy") || e.target.matches("span.copyboard")) {
      copy(e.target);
    } 
  });

  const content = document.querySelector(".content")
  
  function putUrlOnThePage(url) {
    let shortenUrl = document.createElement("div");
    shortenUrl.classList.add("shorten-url");
    let urlLink = document.createElement("a");
    urlLink.classList.add("shorten-url-link");
    urlLink.href = url;
    urlLink.target = "_black";
    urlLink.textContent = url;
    let copyboard = document.createElement("span");
    copyboard.classList.add("copyboard");
    let copyIcon = document.createElement("i");
    copyIcon.classList.add("fa-regular", "fa-copy");
    copyboard.appendChild(copyIcon);
    shortenUrl.appendChild(urlLink);
    shortenUrl.appendChild(copyboard);
    document.querySelector(".content").appendChild(shortenUrl);
    document.querySelector(".content").classList.add("show");
  }
  

const shortenForm = document.getElementById("shorten-form");
console.log("shortenForm",shortenForm)
shortenForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let formData = new FormData(shortenForm);
    let payload = {url: formData.get("url")};

    //       Male request to API

    try {
        let request = await fetch(API_URL + "/api/shorten", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(payload),
        });

        let response = await request.json();

        console.log("response", response);
        if( response.short ){
            putUrlOnThePage(response.short);
        }else{
            content.innerHTML = response.message;
        }

    } catch (error) {
        console.log(error)
    }

})