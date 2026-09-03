/* =========================================
   MEDNEON DOCTOR DIRECTORY
========================================= */


/* =========================================
   DEFAULT SCHEDULE
========================================= */

const defaultSchedule = {

    monday: {
        enabled: true,
        start: "17:00",
        end: "21:00"
    },

    tuesday: {
        enabled: true,
        start: "17:00",
        end: "21:00"
    },

    wednesday: {
        enabled: true,
        start: "17:00",
        end: "21:00"
    },

    thursday: {
        enabled: true,
        start: "17:00",
        end: "21:00"
    },

    friday: {
        enabled: false,
        start: "17:00",
        end: "21:00"
    },

    saturday: {
        enabled: true,
        start: "10:00",
        end: "14:00"
    },

    sunday: {
        enabled: false,
        start: "10:00",
        end: "14:00"
    }

};


/* =========================================
   DEFAULT DOCTORS
========================================= */

const defaultDoctors = [

    {
        id: 1,

        name: "Dr. Sarah Ahmed",

        specialty: "Cardiologist",

        phone: "+880 1712-345678",

        email: "sarah.ahmed@example.com",

        address:
            "Dhanmondi, Dhaka, Bangladesh",

        location:
            "Dhanmondi, Dhaka",

        lat: 23.7461,

        lng: 90.3742,

        image: "",

        schedule:
            JSON.parse(
                JSON.stringify(defaultSchedule)
            )
    },

    {
        id: 2,

        name: "Dr. Rahim Hasan",

        specialty: "Neurologist",

        phone: "+880 1812-456789",

        email: "rahim.hasan@example.com",

        address:
            "Uttara, Dhaka, Bangladesh",

        location:
            "Uttara, Dhaka",

        lat: 23.8759,

        lng: 90.3795,

        image: "",

        schedule:
            JSON.parse(
                JSON.stringify(defaultSchedule)
            )
    },

    {
        id: 3,

        name: "Dr. Nusrat Jahan",

        specialty: "Dermatologist",

        phone: "+880 1912-567890",

        email: "nusrat.jahan@example.com",

        address:
            "Dhanmondi, Dhaka, Bangladesh",

        location:
            "Dhanmondi, Dhaka",

        lat: 23.7461,

        lng: 90.3742,

        image: "",

        schedule:
            JSON.parse(
                JSON.stringify(defaultSchedule)
            )
    }

];


/* =========================================
   DOM
========================================= */

const loginBtn =
    document.getElementById("loginBtn");

const logoutBtn =
    document.getElementById("logoutBtn");

const loginModal =
    document.getElementById("loginModal");

const doctorModal =
    document.getElementById("doctorModal");

const detailsModal =
    document.getElementById("detailsModal");

const deleteModal =
    document.getElementById("deleteModal");

const loginForm =
    document.getElementById("loginForm");

const doctorForm =
    document.getElementById("doctorForm");

const addDoctorBtn =
    document.getElementById("addDoctorBtn");

const userArea =
    document.getElementById("userArea");

const usernameDisplay =
    document.getElementById("usernameDisplay");

const doctorGrid =
    document.getElementById("doctorGrid");

const doctorCount =
    document.getElementById("doctorCount");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const toast =
    document.getElementById("toast");

const doctorImage =
    document.getElementById("doctorImage");

const imagePreview =
    document.getElementById("imagePreview");

const detailsContent =
    document.getElementById("detailsContent");

const deleteDoctorName =
    document.getElementById("deleteDoctorName");

const confirmDeleteBtn =
    document.getElementById("confirmDeleteBtn");

const cancelDeleteBtn =
    document.getElementById("cancelDeleteBtn");

const geocodeStatus =
    document.getElementById("geocodeStatus");


/* =========================================
   STATE
========================================= */

let selectedImage = "";

let editingDoctorId = null;

let doctorToDeleteId = null;

let doctorMap = null;

let doctorMarker = null;


/* =========================================
   LOAD DOCTORS
========================================= */

let doctors = null;

try {

    doctors =
        JSON.parse(
            localStorage.getItem(
                "medneonDoctors"
            )
        );

} catch (error) {

    console.error(
        "Could not read doctors:",
        error
    );

}

if (!Array.isArray(doctors)) {

    doctors =
        JSON.parse(
            JSON.stringify(
                defaultDoctors
            )
        );

    saveDoctors();

} else {

    doctors =
        normalizeDoctors(
            doctors
        );

    saveDoctors();

}


/* =========================================
   LOGIN
========================================= */

let isLoggedIn =
    localStorage.getItem(
        "medneonLoggedIn"
    ) === "true";


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateLoginUI();

        renderDoctors(
            doctors
        );

        initializeScheduleControls();

        console.log(
            "MedNeon initialized."
        );

        console.log(
            "Leaflet loaded:",
            !!window.L
        );

    }
);


/* =========================================
   NORMALIZE
========================================= */

function normalizeDoctors(list) {

    return list.map(
        doctor => {

            return {

                ...doctor,

                address:
                    doctor.address ||
                    doctor.location ||
                    "",

                location:
                    doctor.location ||
                    doctor.address ||
                    "",

                lat:
                    isValidCoordinates(
                        doctor.lat,
                        doctor.lng
                    )
                        ? Number(
                            doctor.lat
                        )
                        : null,

                lng:
                    isValidCoordinates(
                        doctor.lat,
                        doctor.lng
                    )
                        ? Number(
                            doctor.lng
                        )
                        : null,

                schedule:
                    mergeSchedule(
                        doctor.schedule
                    )

            };

        }
    );

}


/* =========================================
   MERGE SCHEDULE
========================================= */

function mergeSchedule(schedule) {

    const result =
        JSON.parse(
            JSON.stringify(
                defaultSchedule
            )
        );

    if (
        schedule &&
        typeof schedule === "object"
    ) {

        Object.keys(result)
            .forEach(day => {

                if (
                    schedule[day]
                ) {

                    result[day] = {
                        ...result[day],
                        ...schedule[day]
                    };

                }

            });

    }

    return result;

}


/* =========================================
   LOGIN
========================================= */

loginBtn?.addEventListener(
    "click",
    () => {

        openModal(
            loginModal
        );

    }
);


loginForm?.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const username =
            getValue("username");

        const password =
            getValue("password");

        if (
            username === "admin" &&
            password === "1234"
        ) {

            isLoggedIn = true;

            localStorage.setItem(
                "medneonLoggedIn",
                "true"
            );

            localStorage.setItem(
                "medneonUsername",
                username
            );

            updateLoginUI();

            closeModal(
                loginModal
            );

            loginForm.reset();

            renderDoctors(
                getCurrentDoctors()
            );

            showToast(
                "Login successful!"
            );

        } else {

            showToast(
                "Invalid username or password."
            );

        }

    }
);


/* =========================================
   LOGOUT
========================================= */

logoutBtn?.addEventListener(
    "click",
    () => {

        isLoggedIn = false;

        localStorage.removeItem(
            "medneonLoggedIn"
        );

        localStorage.removeItem(
            "medneonUsername"
        );

        updateLoginUI();

        renderDoctors(
            getCurrentDoctors()
        );

        showToast(
            "You have been logged out."
        );

    }
);


/* =========================================
   LOGIN UI
========================================= */

function updateLoginUI() {

    if (isLoggedIn) {

        loginBtn?.classList.add(
            "hidden"
        );

        userArea?.classList.remove(
            "hidden"
        );

        if (usernameDisplay) {

            usernameDisplay.textContent =
                localStorage.getItem(
                    "medneonUsername"
                ) || "Admin";

        }

    } else {

        loginBtn?.classList.remove(
            "hidden"
        );

        userArea?.classList.add(
            "hidden"
        );

    }

}


/* =========================================
   ADD DOCTOR
========================================= */

addDoctorBtn?.addEventListener(
    "click",
    () => {

        if (!isLoggedIn) {

            openModal(
                loginModal
            );

            return;

        }

        resetDoctorForm();

        openModal(
            doctorModal
        );

    }
);


/* =========================================
   IMAGE
========================================= */

doctorImage?.addEventListener(
    "change",
    function () {

        const file =
            this.files?.[0];

        if (!file) {
            return;
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showToast(
                "Please select a valid image."
            );

            this.value = "";

            return;

        }

        if (
            file.size >
            2 * 1024 * 1024
        ) {

            showToast(
                "Image must be smaller than 2MB."
            );

            this.value = "";

            return;

        }

        const reader =
            new FileReader();

        reader.onload =
            event => {

                selectedImage =
                    event.target.result;

                imagePreview.innerHTML = `
                    <img
                        src="${escapeHTML(selectedImage)}"
                        alt="Doctor profile"
                    >
                `;

            };

        reader.readAsDataURL(file);

    }
);


/* =========================================
   SCHEDULE CONTROLS
========================================= */

function initializeScheduleControls() {

    document
        .querySelectorAll(
            ".schedule-table tbody tr"
        )
        .forEach(row => {

            const checkbox =
                row.querySelector(
                    ".day-toggle"
                );

            const start =
                row.querySelector(
                    ".schedule-start"
                );

            const end =
                row.querySelector(
                    ".schedule-end"
                );

            checkbox?.addEventListener(
                "change",
                () => {

                    start.disabled =
                        !checkbox.checked;

                    end.disabled =
                        !checkbox.checked;

                }
            );

        });

}


/* =========================================
   COLLECT SCHEDULE
========================================= */

function collectSchedule() {

    const schedule = {};

    document
        .querySelectorAll(
            ".schedule-table tbody tr"
        )
        .forEach(row => {

            const day =
                row.dataset.day;

            const enabled =
                row.querySelector(
                    ".day-toggle"
                ).checked;

            const start =
                row.querySelector(
                    ".schedule-start"
                ).value;

            const end =
                row.querySelector(
                    ".schedule-end"
                ).value;

            schedule[day] = {
                enabled,
                start,
                end
            };

        });

    return schedule;

}


/* =========================================
   LOAD SCHEDULE
========================================= */

function loadSchedule(schedule) {

    const data =
        mergeSchedule(schedule);

    document
        .querySelectorAll(
            ".schedule-table tbody tr"
        )
        .forEach(row => {

            const day =
                row.dataset.day;

            const item =
                data[day];

            if (!item) {
                return;
            }

            const checkbox =
                row.querySelector(
                    ".day-toggle"
                );

            const start =
                row.querySelector(
                    ".schedule-start"
                );

            const end =
                row.querySelector(
                    ".schedule-end"
                );

            checkbox.checked =
                !!item.enabled;

            start.value =
                item.start || "17:00";

            end.value =
                item.end || "21:00";

            start.disabled =
                !checkbox.checked;

            end.disabled =
                !checkbox.checked;

        });

}


/* =========================================
   ADD / EDIT DOCTOR
========================================= */

doctorForm?.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        if (!isLoggedIn) {

            showToast(
                "Please login first."
            );

            return;

        }

        const address =
            getValue(
                "doctorAddress"
            );

        const doctorData = {

            name:
                getValue(
                    "doctorName"
                ),

            specialty:
                getValue(
                    "doctorSpecialty"
                ),

            phone:
                getValue(
                    "doctorPhone"
                ),

            email:
                getValue(
                    "doctorEmail"
                ),

            address,

            location:
                getValue(
                    "doctorLocation"
                ),

            lat:
                getNumberValue(
                    "doctorLat"
                ),

            lng:
                getNumberValue(
                    "doctorLng"
                ),

            image:
                selectedImage || "",

            schedule:
                collectSchedule()

        };


        if (
            !doctorData.name ||
            !doctorData.specialty ||
            !doctorData.phone ||
            !doctorData.email ||
            !doctorData.address ||
            !doctorData.location
        ) {

            showToast(
                "Please fill in all fields."
            );

            return;

        }


        if (
            !validateSchedule(
                doctorData.schedule
            )
        ) {

            return;

        }


        /* =====================================
           GEOCODE
        ===================================== */

        setGeocodeStatus(
            "Finding address on map...",
            ""
        );


        const coordinates =
            await geocodeAddress(
                doctorData.address
            );


        if (coordinates) {

            doctorData.lat =
                coordinates.lat;

            doctorData.lng =
                coordinates.lng;

            setValue(
                "doctorLat",
                coordinates.lat
            );

            setValue(
                "doctorLng",
                coordinates.lng
            );

            setGeocodeStatus(
                "✓ Address located successfully.",
                "success"
            );

        } else {

            if (
                !isValidCoordinates(
                    doctorData.lat,
                    doctorData.lng
                )
            ) {

                setGeocodeStatus(
                    "Could not find this address. Please enter a more specific address.",
                    "error"
                );

                showToast(
                    "Map location could not be found."
                );

                return;

            }

            setGeocodeStatus(
                "Using existing map coordinates.",
                "success"
            );

        }


        /* =====================================
           EDIT
        ===================================== */

        if (
            editingDoctorId !== null
        ) {

            const index =
                doctors.findIndex(
                    doctor =>
                        Number(
                            doctor.id
                        ) ===
                        Number(
                            editingDoctorId
                        )
                );

            if (index === -1) {

                showToast(
                    "Doctor not found."
                );

                return;

            }

            doctors[index] = {

                ...doctors[index],

                ...doctorData

            };

            if (!saveDoctors()) {
                return;
            }

            renderDoctors(
                getCurrentDoctors()
            );

            resetDoctorForm();

            closeModal(
                doctorModal
            );

            showToast(
                "Doctor updated successfully!"
            );

            return;

        }


        /* =====================================
           ADD
        ===================================== */

        const newDoctor = {

            id:
                Date.now(),

            ...doctorData

        };

        doctors.unshift(
            newDoctor
        );

        if (!saveDoctors()) {

            doctors.shift();

            return;

        }

        renderDoctors(
            getCurrentDoctors()
        );

        resetDoctorForm();

        closeModal(
            doctorModal
        );

        showToast(
            "Doctor added successfully!"
        );

    }
);


/* =========================================
   VALIDATE SCHEDULE
========================================= */

function validateSchedule(schedule) {

    for (
        const day in schedule
    ) {

        const item =
            schedule[day];

        if (!item.enabled) {
            continue;
        }

        if (
            !item.start ||
            !item.end
        ) {

            showToast(
                `Please set both times for ${capitalize(day)}.`
            );

            return false;

        }

        if (
            item.start >= item.end
        ) {

            showToast(
                `${capitalize(day)} ending time must be after starting time.`
            );

            return false;

        }

    }

    return true;

}


/* =========================================
   SAVE
========================================= */

function saveDoctors() {

    try {

        localStorage.setItem(
            "medneonDoctors",
            JSON.stringify(doctors)
        );

        return true;

    } catch (error) {

        console.error(
            error
        );

        showToast(
            "Storage is full. Try a smaller image."
        );

        return false;

    }

}


/* =========================================
   RENDER
========================================= */

function renderDoctors(list) {

    if (!doctorGrid) {
        return;
    }

    doctorGrid.innerHTML = "";

    doctorCount.textContent =
        `${list.length} doctor${
            list.length !== 1
                ? "s"
                : ""
        }`;

    if (
        list.length === 0
    ) {

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }

    emptyState.classList.add(
        "hidden"
    );

    list.forEach(
        (doctor, index) => {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "doctor-card";

            card.dataset.id =
                doctor.id;

            card.style.animationDelay =
                `${index * 70}ms`;

            const initials =
                getInitials(
                    doctor.name
                );

            const imageHTML =
                doctor.image

                    ? `
                        <img
                            src="${escapeHTML(doctor.image)}"
                            alt="${escapeHTML(doctor.name)}"
                        >
                    `

                    : escapeHTML(
                        initials
                    );

            const actions =
                isLoggedIn

                    ? `
                        <div class="doctor-actions">

                            <button
                                type="button"
                                class="edit-btn"
                                data-id="${doctor.id}"
                            >
                                ✎ Edit
                            </button>

                            <button
                                type="button"
                                class="delete-btn"
                                data-id="${doctor.id}"
                            >
                                🗑 Delete
                            </button>

                        </div>
                    `

                    : "";

            card.innerHTML = `

                <div class="doctor-top">

                    <div class="doctor-avatar">
                        ${imageHTML}
                    </div>

                    <div>

                        <h3 class="doctor-name">
                            ${escapeHTML(doctor.name)}
                        </h3>

                        <div class="doctor-specialty">
                            ${escapeHTML(doctor.specialty)}
                        </div>

                    </div>

                </div>

                <div class="info-list">

                    <div class="info-item">

                        <span class="info-icon">
                            ☎
                        </span>

                        <span>
                            ${escapeHTML(doctor.phone)}
                        </span>

                    </div>

                    <div class="info-item">

                        <span class="info-icon">
                            @
                        </span>

                        <span>
                            ${escapeHTML(doctor.email)}
                        </span>

                    </div>

                    <div class="info-item">

                        <span class="info-icon">
                            ◉
                        </span>

                        <span>
                            ${escapeHTML(doctor.location)}
                        </span>

                    </div>

                    <div class="info-item">

                        <span class="info-icon">
                            📍
                        </span>

                        <span>
                            ${escapeHTML(doctor.address)}
                        </span>

                    </div>

                </div>

                ${actions}

            `;

            doctorGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================
   CARD CLICK
========================================= */

doctorGrid?.addEventListener(
    "click",
    event => {

        const editButton =
            event.target.closest(
                ".edit-btn"
            );

        if (editButton) {

            event.stopPropagation();

            if (!isLoggedIn) {

                showToast(
                    "Please login first."
                );

                return;

            }

            editDoctor(
                Number(
                    editButton.dataset.id
                )
            );

            return;

        }


        const deleteButton =
            event.target.closest(
                ".delete-btn"
            );

        if (deleteButton) {

            event.stopPropagation();

            if (!isLoggedIn) {

                showToast(
                    "Please login first."
                );

                return;

            }

            openDeleteModal(
                Number(
                    deleteButton.dataset.id
                )
            );

            return;

        }


        const card =
            event.target.closest(
                ".doctor-card"
            );

        if (!card) {
            return;
        }

        openDoctorDetails(
            Number(
                card.dataset.id
            )
        );

    }
);


/* =========================================
   EDIT
========================================= */

function editDoctor(id) {

    const doctor =
        doctors.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!doctor) {

        showToast(
            "Doctor not found."
        );

        return;

    }

    editingDoctorId =
        doctor.id;

    document.getElementById(
        "doctorModalTitle"
    ).textContent =
        "Edit Doctor";

    doctorForm.querySelector(
        ".submit-btn"
    ).textContent =
        "Save Changes";

    setValue(
        "doctorName",
        doctor.name
    );

    setValue(
        "doctorSpecialty",
        doctor.specialty
    );

    setValue(
        "doctorPhone",
        doctor.phone
    );

    setValue(
        "doctorEmail",
        doctor.email
    );

    setValue(
        "doctorAddress",
        doctor.address
    );

    setValue(
        "doctorLocation",
        doctor.location
    );

    setValue(
        "doctorLat",
        doctor.lat
    );

    setValue(
        "doctorLng",
        doctor.lng
    );

    selectedImage =
        doctor.image || "";

    if (doctor.image) {

        imagePreview.innerHTML = `
            <img
                src="${escapeHTML(doctor.image)}"
                alt="Doctor profile"
            >
        `;

    } else {

        imagePreview.innerHTML =
            "<span>👤</span>";

    }

    loadSchedule(
        doctor.schedule
    );

    setGeocodeStatus(
        isValidCoordinates(
            doctor.lat,
            doctor.lng
        )
            ? "Existing map location loaded."
            : "",
        isValidCoordinates(
            doctor.lat,
            doctor.lng
        )
            ? "success"
            : ""
    );

    openModal(
        doctorModal
    );

}


/* =========================================
   DELETE
========================================= */

function openDeleteModal(id) {

    const doctor =
        doctors.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!doctor) {

        showToast(
            "Doctor not found."
        );

        return;

    }

    doctorToDeleteId =
        doctor.id;

    deleteDoctorName.textContent =
        doctor.name;

    openModal(
        deleteModal
    );

}


cancelDeleteBtn?.addEventListener(
    "click",
    () => {

        doctorToDeleteId =
            null;

        closeModal(
            deleteModal
        );

    }
);


confirmDeleteBtn?.addEventListener(
    "click",
    () => {

        if (
            doctorToDeleteId === null
        ) {
            return;
        }

        const doctor =
            doctors.find(
                item =>
                    Number(item.id) ===
                    Number(doctorToDeleteId)
            );

        doctors =
            doctors.filter(
                item =>
                    Number(item.id) !==
                    Number(doctorToDeleteId)
            );

        if (!saveDoctors()) {
            return;
        }

        renderDoctors(
            getCurrentDoctors()
        );

        closeModal(
            deleteModal
        );

        showToast(
            `${doctor?.name || "Doctor"} has been deleted.`
        );

        doctorToDeleteId =
            null;

    }
);


/* =========================================
   SEARCH
========================================= */

searchInput?.addEventListener(
    "input",
    () => {

        renderDoctors(
            getCurrentDoctors()
        );

    }
);


searchBtn?.addEventListener(
    "click",
    () => {

        renderDoctors(
            getCurrentDoctors()
        );

    }
);


/* =========================================
   CURRENT DOCTORS
========================================= */

function getCurrentDoctors() {

    const query =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";

    if (!query) {
        return doctors;
    }

    return doctors.filter(
        doctor => {

            return [

                doctor.name,

                doctor.specialty,

                doctor.location,

                doctor.address,

                doctor.phone,

                doctor.email

            ]
                .join(" ")
                .toLowerCase()
                .includes(
                    query
                );

        }
    );

}


/* =========================================
   DOCTOR DETAILS
========================================= */

function openDoctorDetails(id) {

    const doctor =
        doctors.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!doctor) {

        showToast(
            "Doctor not found."
        );

        return;

    }


    const initials =
        getInitials(
            doctor.name
        );

    const imageHTML =
        doctor.image

            ? `
                <img
                    src="${escapeHTML(doctor.image)}"
                    alt="${escapeHTML(doctor.name)}"
                >
            `

            : escapeHTML(
                initials
            );


    const scheduleHTML =
        buildScheduleHTML(
            doctor.schedule
        );


    const hasCoordinates =
        isValidCoordinates(
            doctor.lat,
            doctor.lng
        );


    let mapHTML;


    if (hasCoordinates) {

        mapHTML = `

            <div class="map-container">

                <div id="doctorMap"></div>

            </div>

            <a
                class="maps-button"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${doctor.lat},${doctor.lng}`
                )}"
            >
                🧭 Open Location in Google Maps
            </a>

        `;

    } else {

        mapHTML = `

            <div class="map-container">

                <div
                    style="
                        height:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        color:#7e8ba3;
                        text-align:center;
                        padding:20px;
                    "
                >

                    📍 Map coordinates are not available
                    for this doctor.

                </div>

            </div>

        `;

    }


    detailsContent.innerHTML = `

        <div class="detail-header">

            <div class="detail-avatar">

                ${imageHTML}

            </div>

            <div>

                <h2 class="detail-name">
                    ${escapeHTML(doctor.name)}
                </h2>

                <div class="detail-specialty">
                    ${escapeHTML(doctor.specialty)}
                </div>

            </div>

        </div>


        <div class="detail-info-grid">

            <div class="detail-info">

                <div class="detail-info-label">
                    Phone
                </div>

                <div class="detail-info-value">

                    <a
                        href="tel:${escapeHTML(doctor.phone)}"
                    >
                        ${escapeHTML(doctor.phone)}
                    </a>

                </div>

            </div>


            <div class="detail-info">

                <div class="detail-info-label">
                    Email
                </div>

                <div class="detail-info-value">

                    <a
                        href="mailto:${escapeHTML(doctor.email)}"
                    >
                        ${escapeHTML(doctor.email)}
                    </a>

                </div>

            </div>


            <div class="detail-info">

                <div class="detail-info-label">
                    Area
                </div>

                <div class="detail-info-value">
                    ${escapeHTML(doctor.location)}
                </div>

            </div>


            <div class="detail-info">

                <div class="detail-info-label">
                    Full Address
                </div>

                <div class="detail-info-value">
                    ${escapeHTML(doctor.address)}
                </div>

            </div>

        </div>


        <div class="detail-columns">

            <div class="detail-panel">

                <div class="detail-panel-header">

                    <h3>
                        🕐 Weekly Availability
                    </h3>

                </div>

                <div class="detail-panel-body">

                    ${scheduleHTML}

                </div>

            </div>


            <div class="detail-panel">

                <div class="detail-panel-header">

                    <h3>
                        📍 Location
                    </h3>

                </div>

                <div class="detail-panel-body">

                    ${mapHTML}

                </div>

            </div>

        </div>

    `;


    /*
        FIRST open the modal.
    */

    openModal(
        detailsModal
    );


    /*
        THEN initialize Leaflet.
        Two animation frames guarantee
        the modal has been rendered.
    */

    if (hasCoordinates) {

        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    () => {

                        initializeDoctorMap(
                            doctor
                        );

                    }
                );

            }
        );

    }

}


/* =========================================
   MAP INITIALIZATION
========================================= */

function initializeDoctorMap(doctor) {

    const mapElement =
        document.getElementById(
            "doctorMap"
        );


    if (!mapElement) {

        console.error(
            "Map element #doctorMap not found."
        );

        return;

    }


    /*
        Check Leaflet.
    */

    if (!window.L) {

        console.error(
            "Leaflet is not loaded."
        );

        mapElement.innerHTML = `

            <div
                style="
                    height:100%;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    padding:20px;
                    text-align:center;
                    color:#ff4664;
                "
            >
                ❌ Leaflet could not be loaded.
                <br>
                Please check your internet connection
                or browser console.
            </div>

        `;

        return;

    }


    /*
        Check coordinates.
    */

    if (
        !isValidCoordinates(
            doctor.lat,
            doctor.lng
        )
    ) {

        console.error(
            "Invalid coordinates:",
            doctor.lat,
            doctor.lng
        );

        return;

    }


    /*
        Remove old map.
    */

    if (doctorMap) {

        try {

            doctorMap.remove();

        } catch (error) {

            console.warn(
                "Could not remove old map:",
                error
            );

        }

        doctorMap =
            null;

        doctorMarker =
            null;

    }


    /*
        Make sure container is empty.
    */

    mapElement.innerHTML = "";


    const lat =
        Number(
            doctor.lat
        );

    const lng =
        Number(
            doctor.lng
        );


    console.log(
        "Initializing Leaflet map:",
        lat,
        lng
    );


    /*
        CREATE MAP
    */

    doctorMap =
        L.map(
            mapElement,
            {
                center: [
                    lat,
                    lng
                ],

                zoom: 16,

                zoomControl: true,

                scrollWheelZoom: true,

                dragging: true,

                touchZoom: true,

                doubleClickZoom: true,

                boxZoom: true,

                keyboard: true
            }
        );


    /*
        OPENSTREETMAP TILES
    */

    const tileLayer =
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,

                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        );


    tileLayer.addTo(
        doctorMap
    );


    /*
        MARKER
    */

    doctorMarker =
        L.marker(
            [
                lat,
                lng
            ]
        )
        .addTo(
            doctorMap
        );


    doctorMarker.bindPopup(
        `
            <strong>
                ${escapeHTML(doctor.name)}
            </strong>

            <br>

            ${escapeHTML(doctor.address)}
        `
    );


    doctorMarker.openPopup();


    /*
        VERY IMPORTANT:
        Leaflet needs to recalculate
        dimensions after modal rendering.
    */

    setTimeout(
        () => {

            if (!doctorMap) {
                return;
            }

            doctorMap.invalidateSize(
                true
            );

            doctorMap.setView(
                [
                    lat,
                    lng
                ],
                16,
                {
                    animate: false
                }
            );

        },
        100
    );


    /*
        Another size recalculation
        after everything settles.
    */

    setTimeout(
        () => {

            doctorMap?.invalidateSize(
                true
            );

        },
        500
    );


    /*
        Tile error detection.
    */

    tileLayer.on(
        "tileerror",
        event => {

            console.error(
                "OpenStreetMap tile failed:",
                event
            );

        }
    );

}


/* =========================================
   BUILD SCHEDULE
========================================= */

function buildScheduleHTML(schedule) {

    const data =
        mergeSchedule(
            schedule
        );

    const days = [

        ["monday", "Monday"],

        ["tuesday", "Tuesday"],

        ["wednesday", "Wednesday"],

        ["thursday", "Thursday"],

        ["friday", "Friday"],

        ["saturday", "Saturday"],

        ["sunday", "Sunday"]

    ];


    return `

        <div class="detail-schedule">

            ${days
                .map(
                    ([key, label]) => {

                        const item =
                            data[key];

                        let hours;

                        if (
                            item.enabled
                        ) {

                            hours =
                                `${formatTime(
                                    item.start
                                )} - ${formatTime(
                                    item.end
                                )}`;

                        } else {

                            hours =
                                "Closed";

                        }

                        return `

                            <div
                                class="detail-schedule-row"
                            >

                                <span class="detail-day">
                                    ${label}
                                </span>

                                <span
                                    class="detail-hours ${
                                        item.enabled
                                            ? ""
                                            : "closed"
                                    }"
                                >
                                    ${hours}
                                </span>

                            </div>

                        `;

                    }
                )
                .join("")
            }

        </div>

    `;

}


/* =========================================
   GEOCODING
========================================= */

async function geocodeAddress(address) {

    try {

        const query =
            encodeURIComponent(
                address
            );


        const url =
            `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=bd&q=${query}`;


        console.log(
            "Geocoding:",
            address
        );


        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Geocoding HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            console.warn(
                "No geocoding result:",
                address
            );

            return null;

        }


        const result =
            data[0];


        const lat =
            Number(
                result.lat
            );

        const lng =
            Number(
                result.lon
            );


        if (
            !isValidCoordinates(
                lat,
                lng
            )
        ) {

            return null;

        }


        console.log(
            "Geocoding result:",
            lat,
            lng
        );


        return {
            lat,
            lng
        };


    } catch (error) {

        console.error(
            "Geocoding error:",
            error
        );

        return null;

    }

}


/* =========================================
   MODALS
========================================= */

document
    .querySelectorAll(
        ".close-modal"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const modalId =
                        button.dataset.close;

                    const modal =
                        document.getElementById(
                            modalId
                        );

                    closeModal(
                        modal
                    );

                }
            );

        }
    );


document
    .querySelectorAll(
        ".modal"
    )
    .forEach(
        modal => {

            modal.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modal
                    ) {

                        closeModal(
                            modal
                        );

                    }

                }
            );

        }
    );


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {
            return;
        }

        document
            .querySelectorAll(
                ".modal.active"
            )
            .forEach(
                modal => {

                    closeModal(
                        modal
                    );

                }
            );

    }
);


/* =========================================
   OPEN MODAL
========================================= */

function openModal(modal) {

    if (!modal) {
        return;
    }

    modal.classList.add(
        "active"
    );

    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeModal(modal) {

    if (!modal) {
        return;
    }


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    if (
        modal === doctorModal
    ) {

        resetDoctorForm();

    }


    /*
        Destroy Leaflet map when
        details modal closes.
    */

    if (
        modal === detailsModal
    ) {

        if (doctorMap) {

            try {

                doctorMap.remove();

            } catch (error) {

                console.warn(
                    error
                );

            }

            doctorMap =
                null;

            doctorMarker =
                null;

        }

    }

}


/* =========================================
   RESET DOCTOR FORM
========================================= */

function resetDoctorForm() {

    editingDoctorId =
        null;

    selectedImage =
        "";

    doctorForm?.reset();

    if (doctorImage) {

        doctorImage.value =
            "";

    }

    if (imagePreview) {

        imagePreview.innerHTML =
            "<span>👤</span>";

    }

    setValue(
        "doctorLat",
        ""
    );

    setValue(
        "doctorLng",
        ""
    );

    const title =
        document.getElementById(
            "doctorModalTitle"
        );

    if (title) {

        title.textContent =
            "Add Doctor";

    }

    const submit =
        doctorForm?.querySelector(
            ".submit-btn"
        );

    if (submit) {

        submit.textContent =
            "Add Doctor";

    }

    setGeocodeStatus(
        ""
    );

    loadSchedule(
        defaultSchedule
    );

}


/* =========================================
   GEOCODE STATUS
========================================= */

function setGeocodeStatus(
    message,
    type = ""
) {

    if (!geocodeStatus) {
        return;
    }

    geocodeStatus.textContent =
        message;

    geocodeStatus.className =
        "geocode-status";

    if (type) {

        geocodeStatus.classList.add(
            type
        );

    }

}


/* =========================================
   TOAST
========================================= */

let toastTimer = null;

function showToast(message) {

    if (!toast) {
        return;
    }

    toast.textContent =
        message;

    toast.classList.add(
        "show"
    );

    clearTimeout(
        toastTimer
    );

    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2800
        );

}


/* =========================================
   VALUE HELPERS
========================================= */

function getValue(id) {

    const element =
        document.getElementById(
            id
        );

    return element
        ? element.value.trim()
        : "";

}


function getNumberValue(id) {

    const value =
        getValue(id);

    if (!value) {
        return null;
    }

    const number =
        Number(value);

    return Number.isFinite(
        number
    )
        ? number
        : null;

}


function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );

    if (element) {

        element.value =
            value ?? "";

    }

}


/* =========================================
   COORDINATES
========================================= */

function isValidCoordinates(
    lat,
    lng
) {

    const latitude =
        Number(lat);

    const longitude =
        Number(lng);

    return (

        Number.isFinite(
            latitude
        )

        &&

        Number.isFinite(
            longitude
        )

        &&

        latitude >= -90

        &&

        latitude <= 90

        &&

        longitude >= -180

        &&

        longitude <= 180

    );

}


/* =========================================
   INITIALS
========================================= */

function getInitials(name) {

    if (!name) {
        return "?";
    }

    return name

        .replace(
            /^Dr\.\s*/i,
            ""
        )

        .trim()

        .split(
            /\s+/
        )

        .slice(
            0,
            2
        )

        .map(
            word =>
                word
                    .charAt(0)
                    .toUpperCase()
        )

        .join("");

}


/* =========================================
   FORMAT TIME
========================================= */

function formatTime(time) {

    if (!time) {
        return "";
    }

    const parts =
        time.split(":");

    if (
        parts.length < 2
    ) {
        return time;
    }

    let hour =
        Number(
            parts[0]
        );

    const minute =
        parts[1];

    const period =
        hour >= 12
            ? "PM"
            : "AM";

    hour =
        hour % 12 || 12;

    return `${hour}:${minute} ${period}`;

}


/* =========================================
   CAPITALIZE
========================================= */

function capitalize(value) {

    return value
        .charAt(0)
        .toUpperCase()
        +
        value.slice(1);

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}
