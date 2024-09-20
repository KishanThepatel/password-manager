
function savePasswords(passwords) {
  localStorage.setItem("passwords", JSON.stringify(passwords));
}


function getPasswords() {
  return JSON.parse(localStorage.getItem("passwords")) || [];
}



function renderPasswords() {
  const passwordList = document.getElementById("password-list");
  const passwords = getPasswords();
  passwordList.innerHTML = "";

  passwords.forEach((item, index) => {
    const listItem = document.createElement("li");

    
    const passwordSpan = document.createElement("span");
    passwordSpan.innerHTML = `
        <strong>${item.website}</strong>: 
        <span class="password" id="password-${index}">${"*".repeat(
      item.password.length
    )}</span>
        <i class="fas fa-eye show-password" onclick="togglePassword(${index})" title="Show/HidePassword"></i> 
        `;

    
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("actions");
    actionsDiv.innerHTML = `
        <i class="fas fa-copy" onclick="copyPassword(${index})" title="Copy"></i>
        <i class="fas fa-edit" onclick="promptEditPassword(${index})" title="Edit"></i>
        <i class="fas fa-trash-alt" onclick="confirmDelete(${index})" title="Delete"></i>
        `;

    
    listItem.appendChild(passwordSpan);
    listItem.appendChild(actionsDiv);
    passwordList.appendChild(listItem);
  });
}



document.getElementById("add-btn").addEventListener("click", () => {
  const website = document.getElementById("website").value;
  const password = document.getElementById("password").value;

  if (website && password) {
    const passwords = getPasswords();
    passwords.push({ website, password });
    savePasswords(passwords);
    renderPasswords();
    document.getElementById("website").value = "";
    document.getElementById("password").value = "";
  } else {
    showPopup("Please fill in both fields.");
  }
});



function copyPassword(index) {
  const passwords = getPasswords();
  navigator.clipboard.writeText(passwords[index].password);
  showPopup("Password copied to clipboard.");
}



function showPopup(
  message,
  hasCancel = false,
  isEditing = false,
  index = null
) {
  const popup = document.getElementById("custom-popup");
  const popupMessage = document.getElementById("popup-message");
  const popupInputContainer = document.getElementById("popup-input-container");
  const popupInput = document.getElementById("popup-input");

  popupMessage.textContent = message;
  popupInputContainer.classList.toggle("hidden", !isEditing);
  document
    .getElementById("popup-cancel")
    .classList.toggle("hidden", !hasCancel);

  if (isEditing && index !== null) {
    popupInput.value = getPasswords()[index].password;
  }

  popup.classList.remove("hidden");

  return new Promise((resolve) => {
    document.getElementById("popup-ok").onclick = () => {
      if (isEditing && index !== null) {
        const newPassword = popupInput.value;
        if (newPassword) {
          const passwords = getPasswords();
          passwords[index].password = newPassword;
          savePasswords(passwords);
          renderPasswords();
        } else {
          showPopup("Password cannot be empty.");
          return;
        }
      }
      popup.classList.add("hidden");
      resolve(true);
    };
    if (hasCancel) {
      document.getElementById("popup-cancel").onclick = () => {
        popup.classList.add("hidden");
        resolve(false);
      };
    }
  });
}


async function confirmDelete(index) {
  const confirmed = await showPopup(
    "Are you sure you want to delete this password?",
    true
  );
  if (confirmed) {
    deletePassword(index);
  }
}



async function promptEditPassword(index) {
  await showPopup("Enter new password:", false, true, index);
}


function deletePassword(index) {
  const passwords = getPasswords();
  passwords.splice(index, 1);
  savePasswords(passwords);
  renderPasswords();
}



function togglePassword(index) {
  const passwordSpan = document.getElementById(`password-${index}`);
  const passwords = getPasswords();

  if (
    passwordSpan.textContent === "*".repeat(passwords[index].password.length)
  ) {
    passwordSpan.textContent = passwords[index].password;
  } else {
    passwordSpan.textContent = "*".repeat(passwords[index].password.length);
  }
}


renderPasswords();
