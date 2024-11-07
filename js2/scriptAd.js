const editButtons = document.querySelectorAll('[id^="open-modal-edit"]');
        const modals = document.querySelectorAll('[id^="modal-edit"]');
        const closeButtons = document.querySelectorAll('[id^="close-modal-edit"]');

        // Function to show modal
        const showModal = (modalId) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                // Use setTimeout to ensure the transition happens after display change
                setTimeout(() => {
                    modal.classList.add('opacity-100');
                    modal.querySelector('.relative').classList.remove('scale-95');
                    modal.querySelector('.relative').classList.add('scale-100');
                }, 10);
            }
        };

        // Function to hide modal
        const hideModal = (modalId) => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('opacity-100');
                modal.querySelector('.relative').classList.remove('scale-100');
                modal.querySelector('.relative').classList.add('scale-95');
                // Wait for transition to complete before hiding
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }
        };

        // Add click event listeners to edit buttons
        editButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                showModal(`modal-edit${id}`);
            });
        });

        // Add click event listeners to close buttons
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modalId = button.closest('[id^="modal-edit"]').id;
                hideModal(modalId);
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            modals.forEach(modal => {
                if (e.target === modal) {
                    hideModal(modal.id);
                }
            });
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modals.forEach(modal => {
                    if (!modal.classList.contains('hidden')) {
                        hideModal(modal.id);
                    }
                });
            }
        });


        //modaltambah
        openModalButton.addEventListener('click', () => {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.querySelector('.relative').classList.remove('scale-95');
            }, 10); // Delay to allow for the removal of hidden before transitioning
        });

        // Close the modal when the close button is clicked
        closeModalButton.addEventListener('click', () => {
            modal.classList.add('opacity-0');
            modal.querySelector('.relative').classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300); // Match this duration with CSS transition duration
        });

        // Optional: Close the modal when clicking outside of it
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModalButton.click();
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            const toastMessage = document.getElementById('toastMessage');

            if (toastMessage) {
                // Menampilkan toast message dengan animasi
                setTimeout(() => {
                    toastMessage.classList.add('opacity-100', 'translate-x-0');
                }, 100);

                // Menghilangkan toast message setelah 5 detik
                setTimeout(() => {
                    toastMessage.classList.remove('opacity-100');
                    toastMessage.classList.add('opacity-0');
                    setTimeout(() => {
                        if (toastMessage) {
                            toastMessage.remove();
                        }
                    }, 500); // Waktu untuk efek hilang
                }, 10000); // Waktu untuk menampilkan toast (5 detik)
            }
        });

        const form = document.getElementById('tambahdataform');
        const usernameInput = document.getElementById('username'); // Menambahkan variabel untuk elemen username

        usernameInput.addEventListener('input', function() {
            const username = this.value;


            if (username.length > 0) {
                fetch('../../Config/check_username.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            'username': username
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        const errorElement = document.getElementById('username-error');
                        if (data.exists) {
                            // Tampilkan pesan error jika username sudah ada
                            errorElement.classList.remove('hidden');
                            usernameInput.setCustomValidity("Username telah digunakan"); // Atur custom validity
                        } else {
                            // Sembunyikan pesan error jika username belum ada
                            errorElement.classList.add('hidden');
                            usernameInput.setCustomValidity(""); // Hilangkan custom validity
                        }
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                // Sembunyikan pesan error jika input kosong
                document.getElementById('username-error').classList.add('hidden');
                usernameInput.setCustomValidity(""); // Hilangkan custom validity jika input kosong
            }
        });

        // Cegah submit jika ada custom error pada username
        form.addEventListener('submit', (e) => {
            if (!usernameInput.checkValidity()) {
                e.preventDefault(); // Prevent submit jika ada error
            }
        });

        const formedit = document.getElementById('ubahdataform');
        const usernameInputedit = document.getElementById('usernameedit'); // Menambahkan variabel untuk elemen username

        usernameInputedit.addEventListener('input', function() {
            const usernameedit = this.value;

            if (usernameedit.length > 0) {
                fetch('../../Config/check_username.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            'username': usernameedit
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        const errorElementEdit = document.getElementById('username-erroredit');
                        if (data.exists) {
                            // Tampilkan pesan error jika username sudah ada
                            errorElementEdit.classList.remove('hidden');
                            usernameInputedit.setCustomValidity("Username telah digunakan"); // Atur custom validity
                        } else {
                            // Sembunyikan pesan error jika username belum ada
                            errorElementEdit.classList.add('hidden');
                            usernameInputedit.setCustomValidity(""); // Hilangkan custom validity
                        }
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                // Sembunyikan pesan error jika input kosong
                document.getElementById('username-erroredit').classList.add('hidden');
                usernameInput.setCustomValidity(""); // Hilangkan custom validity jika input kosong
            }
        });

        // Cegah submit jika ada custom error pada username
        formedit.addEventListener('submit', (e) => {
            if (!usernameInputedit.checkValidity()) {
                e.preventDefault(); // Prevent submit jika ada error
            }
        });


        const formtambah = document.getElementById('tambahdataform');
        const projectnameInput = document.getElementById('project-name');

        projectnameInput.addEventListener('input', function() {
            const projectName = this.value;

            if (projectName.length > 0) {
                fetch('../../Config/check_projectname.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            'project-name': projectName
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        const projecterrorElement = document.getElementById('projectname-error');
                        if (data.exists) {
                            // Tampilkan pesan error jika username sudah ada
                            projecterrorElement.classList.remove('hidden');
                            projectnameInput.setCustomValidity("Projectname telah digunakan"); // Atur custom validity
                        } else {
                            // Sembunyikan pesan error jika username belum ada
                            projecterrorElement.classList.add('hidden');
                            projectnameInput.setCustomValidity(""); // Hilangkan custom validity
                        }
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                // Sembunyikan pesan error jika input kosong
                document.getElementById('projectname-error').classList.add('hidden');
                projectnameInput.setCustomValidity(""); // Hilangkan custom validity jika input kosong
            }
        });

        // Cegah submit jika ada custom error pada username
        formtambah.addEventListener('submit', (e) => {
            if (!projectnameInput.checkValidity()) {
                e.preventDefault(); // Prevent submit jika ada error
            }
        });
        const formubah = document.getElementById('ubahdataform');
        const projectnameInputEdit = document.getElementById('project-nameedit');

        projectnameInputEdit.addEventListener('input', function() {
            const projectNameEdit = this.value;

            if (projectNameEdit.length > 0) {
                fetch('../../Config/check_projectname.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams({
                            'project-name': projectNameEdit
                        }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        const projecterrorElementEdit = document.getElementById('projectnameedit-error');
                        if (data.exists) {
                            // Tampilkan pesan error jika username sudah ada
                            projecterrorElementEdit.classList.remove('hidden');
                            projectnameInputEdit.setCustomValidity("Projectname telah digunakan"); // Atur custom validity
                        } else {
                            // Sembunyikan pesan error jika username belum ada
                            projecterrorElementEdit.classList.add('hidden');
                            projectnameInputEdit.setCustomValidity(""); // Hilangkan custom validity
                        }
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                // Sembunyikan pesan error jika input kosong
                document.getElementById('projectnameedit-error').classList.add('hidden');
                projectnameInputEdit.setCustomValidity(""); // Hilangkan custom validity jika input kosong
            }
        });

        // Cegah submit jika ada custom error pada username
        formubah.addEventListener('submit', (e) => {
            if (!projectnameInputEdit.checkValidity()) {
                e.preventDefault(); // Prevent submit jika ada error
            }
        });


        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.getAttribute('data-target');
                const input = document.getElementById(targetId);
                const eyeOpen = toggle.querySelector('.eye-open');
                const eyeClosed = toggle.querySelector('.eye-closed');

                if (input.type === 'password') {
                    input.type = 'text';
                    eyeOpen.classList.add('hidden');
                    eyeClosed.classList.remove('hidden');
                } else {
                    input.type = 'password';
                    eyeOpen.classList.remove('hidden');
                    eyeClosed.classList.add('hidden');
                }
            });
        });

        document.getElementById('hamburger').addEventListener('click', function() {
            var sidebar = document.getElementById('sidebar');
            var mainContent = document.getElementById('main-content');
            const topBar = document.getElementById('top-bar');
            const headerBar = document.getElementById('header-bar');
            const headerTitle = document.getElementById('header-title');

            sidebar.classList.toggle('hidden');
            if (sidebar.classList.contains('hidden')) {
                mainContent.classList.remove('ml-14', 'sm:ml-60');
                topBar.classList.remove('sm:ml-60');
                headerBar.classList.remove('sm:ml-60');
                headerTitle.classList.add('sm:ml-10');
            } else {
                mainContent.classList.add('ml-14', 'sm:ml-60');
                topBar.classList.add('sm:ml-60');
                headerBar.classList.add('sm:ml-60');
                headerTitle.classList.remove('sm:ml-10');
                headerTitle.classList.add('sm:ml-10');
            }
        });

        const autoLogoutTime = 30 * 60 * 1000;

        let logoutTimer;

        function resetLogoutTimer() {
            // Hapus timer yang ada
            clearTimeout(logoutTimer);

            // Setel ulang timer
            logoutTimer = setTimeout(logoutUser, autoLogoutTime);
        }

        function logoutUser() {
            // Redirect ke halaman logout
            window.location.href = '../logout.php';
        }

        // Daftar aktivitas pengguna yang akan menyetel ulang timer
        window.onload = resetLogoutTimer;
        document.onmousemove = resetLogoutTimer; // Mouse bergerak
        document.onkeypress = resetLogoutTimer; // Ketikan
        document.onclick = resetLogoutTimer; // Klik
        document.onscroll = resetLogoutTimer; // Scroll