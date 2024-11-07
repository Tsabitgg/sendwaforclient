document.addEventListener('DOMContentLoaded', function() {
    const billingDataKelas = document.getElementById('dataTagihan');
    const noDataMessage = document.getElementById('noDataMessage');
    const reminderBoxKelas = document.getElementById('reminderbox');
    const checkAllBtn = document.getElementById('checkAllBtn');
    const uncheckAllBtn = document.getElementById('uncheckAllBtn');

    
    // Add checkedItems to store checkbox states
    const checkedItems = new Set();

    checkAllBtn.onclick = function(e) {
        e.preventDefault();
        document.querySelectorAll('.billing-checkbox').forEach(checkbox => {
            checkbox.checked = true;
            // Trigger change event to update reminder messages
            checkbox.dispatchEvent(new Event('change'));
        });
    };

    uncheckAllBtn.onclick = function(e) {
        e.preventDefault();
        document.querySelectorAll('.billing-checkbox').forEach(checkbox => {
            checkbox.checked = false;
            // Trigger change event to update reminder messages
            checkbox.dispatchEvent(new Event('change'));
        });
    };



    let reminderMessages = {};
    const reminderTemplates = [
        `Assalamualaikum Wr Wb,\n\nSalam sejahtera bagi kita semua. Kami ingin menginformasikan kepada Anda, orang tua ananda *{nama_siswa}*, untuk tunggakan tagihan anak Anda sebesar *{jumlah_tagihan}*.\n\nDengan Rincian Tagihan: \n\n{rincian}\n\nDemikian pesan dari kami. Wassalam 🙏.\n\npesan dari *{nama_sekolah}*.\n\nsilahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa.`,

        `Selamat pagi/siang/malam, Bapak/Ibu.\n\nKami ingin mengingatkan bahwa tunggakan tagihan untuk ananda *{nama_siswa}* sebesar *{jumlah_tagihan}* sudah jatuh tempo.\n\nRincian Tagihan:\n\n{rincian}\n\nTerima kasih atas perhatiannya. Salam hormat dari kami 🙏.\n\nPesan otomatis dari *{nama_sekolah}*.\n\nSilahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa.`,

        `Permisi Bapak/Ibu, berikut ini merupakan pesan pengingat untuk tunggakan tagihan sekolah yang dimiliki ananda *{nama_siswa}* yang berjumlah *{jumlah_tagihan}*.\n\nDengan Rincian Tagihannya:\n\n{rincian}\n\nKami harap Bapak/Ibu dapat segera melunasi beban tagihan tersebut. Terima kasih. Wassalamualaikum Wr Wb 🙏.\n\nSilahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa.`,

        `Dengan hormat, kami sampaikan kepada Bapak/Ibu, bahwa tunggakan tagihan untuk ananda *{nama_siswa}* sebesar *{jumlah_tagihan}* sudah harus dibayarkan.\n\nRincian Tagihan:\n\n{rincian}\n\nTerima kasih atas perhatian dan kerja samanya. Wassalam 🙏.\n\nPesan otomatis dari *{nama_sekolah}*.\n\nSilahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa.`,

        `Assalamualaikum Wr Wb,\n\nKami berharap Anda dalam keadaan baik. Kami ingin mengingatkan mengenai tunggakan tagihan ananda *{nama_siswa}* sebesar *{jumlah_tagihan}*.\n\nRincian tagihan dapat Anda lihat di bawah ini:\n\n{rincian}\n\nKami menghargai kerjasama Anda dalam menyelesaikan hal ini.\n\nPesan dari *{nama_sekolah}*.\n\nSilahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa.`,

        `Selamat pagi/siang/malam,\n\nDengan penuh rasa hormat, kami menginformasikan bahwa ananda *{nama_siswa}* memiliki tunggakan tagihan sebesar *{jumlah_tagihan}*.\n\nBerikut adalah rincian tagihan:\n\n{rincian}\n\nKami menghargai perhatian Anda terhadap hal ini.\n\nPesan dari *{nama_sekolah}*.\n\nSilahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa.`,

        `Assalamualaikum,\n\nSalam sejahtera. Kami ingin memberitahukan Anda tentang tunggakan tagihan ananda *{nama_siswa}* yang telah jatuh tempo sebesar *{jumlah_tagihan}*.\n\nRincian tagihan adalah sebagai berikut:\n\n{rincian}\n\nKami berharap Anda dapat segera menindaklanjuti. Terima kasih.\n\nPesan dari *{nama_sekolah}*.\n\nSilahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa.`,

        `Kepada Yth. Bapak/Ibu,\n\nDengan hormat, kami ingin mengingatkan bahwa terdapat tunggakan tagihan untuk ananda *{nama_siswa}* yang totalnya mencapai *{jumlah_tagihan}*.\n\nSilakan lihat rincian tagihan di bawah ini:\n\n{rincian}\n\nTerima kasih atas kerjasama Anda dalam hal ini.\n\nPesan dari *{nama_sekolah}*.\n\nSilahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa.`,

        `Halo Bapak/Ibu,\n\nKami ingin mengingatkan bahwa ananda *{nama_siswa}* memiliki tunggakan tagihan sebesar *{jumlah_tagihan}*.\n\nBerikut rincian tagihan yang perlu Anda ketahui:\n\n{rincian}\n\nKami sangat menghargai perhatian Anda dalam menyelesaikan hal ini.\n\nPesan dari *{nama_sekolah}*.\n\nSilahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa.`,

        `Assalamualaikum Wr Wb,\n\nSalam hormat untuk Anda. Kami ingin menginformasikan tentang tunggakan tagihan untuk ananda *{nama_siswa}* yang sebesar *{jumlah_tagihan}*.\n\nBerikut rincian tagihan:\n\n{rincian}\n\nKami berharap untuk dapat segera menyelesaikan hal ini. Terima kasih.\n\nPesan dari *{nama_sekolah}*.\n\nSilahkan hubungi admin sekolah jika ada kesalahan tagihan atau nama siswa.`
    ];

    function getRandomTemplate() {
        const randomIndex = Math.floor(Math.random() * reminderTemplates.length);
        return reminderTemplates[randomIndex];
    }

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 30;
    let paginatedData = [];

    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    // Function definitions moved outside the event handler
    function renderPage(page, groupedData, namaSekolah) {
        currentPage = page;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageItems = paginatedData.slice(start, end);

        billingDataKelas.innerHTML = '';
        pageItems.forEach(item => {
            if (item.type === 'header') {
                const siswaRow = document.createElement('tr');
                siswaRow.innerHTML = `<td class="py-2 px-4 font-semibold border-b border-gray-700" colspan="6">${item.namaSiswa}</td>`;
                billingDataKelas.appendChild(siswaRow);
            } else {
                const tagihan = item;
                const isChecked = checkedItems.has(tagihan.id_tagihan.toString()); // Check if item was previously checked
                const row = `
    <tr>
        <td class="py-2 px-4 border-b">
            <input type="checkbox" value="${tagihan.id_tagihan}" class="billing-checkbox bg-transparent peer mr-2 appearance-none h-4 w-4 border-2 rounded-full hover:border-teal-500 cursor-pointer border-teal-300"
                data-id-siswa="${tagihan.id_siswa}"
                data-id-tagihan="${tagihan.id_tagihan}"
                data-nama-siswa="${tagihan.nama_siswa}"
                data-tanggal-tagihan="${tagihan.tanggal_tagihan}"
                data-tagihan="${tagihan.tagihan}"
                ${isChecked ? 'checked' : ''}>
        </td>
        <td class="py-2 px-4 border-b border-gray-300">${tagihan.name_tagihan ? tagihan.name_tagihan : '-'}</td>
        <td class="py-2 px-4 border-b">${tagihan.tanggal_tagihan}</td>
        <td class="py-2 px-4 border-b">Rp ${Number(tagihan.tagihan).toLocaleString('id-ID')}</td>
        <td class="py-2 px-4 border-b">${tagihan.tanggal_lunas ? tagihan.tanggal_lunas : "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>Unpaid</span>"}</td>
        <td class="py-2 px-4 border-b">${tagihan.lunas == 1 ? "<span class='inline-block bg-green-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>L</span>" : "<span class='inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs shadow-md'>B</span>"}</td>
    </tr>`;
                billingDataKelas.insertAdjacentHTML('beforeend', row);
            }
        });

        updatePaginationControls();
        attachCheckboxListeners(groupedData, namaSekolah);
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(paginatedData.length / itemsPerPage);
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    function attachCheckboxListeners(groupedData, namaSekolah) {
        document.querySelectorAll('.billing-checkbox').forEach(function(checkbox) {
            const id_siswa = checkbox.dataset.idSiswa;
            const nama_siswa = checkbox.dataset.namaSiswa;

            function updateReminderMessage() {
                if (checkbox.checked) {
                    checkedItems.add(checkbox.value);
                } else {
                    checkedItems.delete(checkbox.value);
                }

                const selectedTagihan = groupedData[nama_siswa].filter(tagihan => {
                    return checkedItems.has(tagihan.id_tagihan.toString()); // Use checkedItems to filter
                });

                const totalTagihan = selectedTagihan.reduce((sum, item) => sum + Number(item.tagihan), 0);
                const rincian = selectedTagihan.map(item => `\u00A0\u00A0\u00A0\u00A0*- ${item.name_tagihan || '-'}: Rp ${Number(item.tagihan).toLocaleString('id-ID')}*`).join('\n');

                if (selectedTagihan.length > 0) {
                    const template = getRandomTemplate();
                    const message = template
                        .replace('{nama_siswa}', nama_siswa)
                        .replace('{rincian}', rincian)
                        .replace('{jumlah_tagihan}', `Rp${totalTagihan.toLocaleString('id-ID')}`)
                        .replace('{nama_sekolah}', namaSekolah);

                    reminderMessages[id_siswa] = [{
                        id_tagihan: checkbox.value,
                        message: message
                    }];
                } else {
                    delete reminderMessages[id_siswa];
                }

                updateReminderBox();
            }

            // Remove existing event listener before adding a new one
            checkbox.removeEventListener('change', updateReminderMessage);
            checkbox.addEventListener('change', updateReminderMessage);

            // Initial update
            updateReminderMessage();
        });
    }

    function updateReminderBox() {
        reminderBoxKelas.innerHTML = '';

        if (Object.keys(reminderMessages).length === 0) {
            reminderBoxKelas.textContent = 'Pesan reminder akan muncul di sini';
        } else {
            // Object.entries(reminderMessages).forEach(([id_siswa, messages]) => {
            //     messages.forEach(({
            //         id_tagihan,
            //         message
            //     }) => {
            //         // reminderBoxKelas.insertAdjacentHTML('beforeend', `<div data-id-tagihan="${id_tagihan}">${message}</div>`);
            //         const formattedMessage = `<div data-id-tagihan="${id_tagihan}" style="white-space: break-spaces; padding: 10px;">${message}</div>`;
            //         reminderBoxKelas.insertAdjacentHTML('beforeend', formattedMessage);
            //     });
            // });

            const entries = Object.entries(reminderMessages);
            entries.forEach(([id_siswa, messages], index) => {
                messages.forEach(({
                    id_tagihan,
                    message
                }) => {
                    const messageDiv = `
    <div data-id-tagihan="${id_tagihan}" style="white-space: pre-line; text-align: justify;">
        ${message}
    </div>`;

                    // Add separator after each message except the last one
                    const separator = index < entries.length - 1 ?
                        '<div style="border-top: 2px dashed #666; margin: 10px 0; text-align: center; color: #666;"></div>' : '';

                    reminderBoxKelas.insertAdjacentHTML('beforeend', messageDiv + separator);
                });
            });
        }

        document.getElementById('hiddenReminderContent').value = JSON.stringify(reminderMessages);
    }

     // Event listener for class selection
     document.getElementById('kelas').addEventListener('change', function() {
        const kelas = this.value;

        // Clear existing content and show loading
        billingDataKelas.innerHTML = '';
        noDataMessage.style.display = 'none';
        reminderBoxKelas.textContent = '';

        if (!kelas) {
            noDataMessage.style.display = 'block';
            return;
        }

        const loadingKelas = `<tr>
                <td colspan="6" class="py-4 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" class="mx-auto w-8 h-8">
                        <circle fill="#2B2527" stroke="#2B2527" stroke-width="15" r="15" cx="40" cy="65">
                            <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate>
                        </circle>
                        <circle fill="#2B2527" stroke="#2B2527" stroke-width="15" r="15" cx="100" cy="65">
                            <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate>
                        </circle>
                        <circle fill="#2B2527" stroke="#2B2527" stroke-width="15" r="15" cx="160" cy="65">
                            <animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate>
                        </circle>
                    </svg>
                </td>
            </tr>`;

        billingDataKelas.innerHTML = loadingKelas;

        // Fetch data
        fetch('../Config/fetchTagihanKelas.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'kelas': kelas
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                billingDataKelas.innerHTML = '';

                if (data.error) {
                    throw new Error(data.error);
                }
                if (data.message) {
                    throw new Error(data.message);
                }
                if (!Array.isArray(data) || data.length === 0) {
                    noDataMessage.style.display = 'block';
                    return;
                }

                // Reset reminder messages
                reminderMessages = {};

                // Group data by student
                const groupedData = data.reduce((acc, tagihan) => {
                    const namaSiswa = tagihan.nama_siswa;
                    if (!acc[namaSiswa]) {
                        acc[namaSiswa] = [];
                    }
                    acc[namaSiswa].push(tagihan);
                    return acc;
                }, {});

                // Get school name
                const namaSekolah = document.getElementById('sekolah').value;

                // Prepare paginated data
                paginatedData = Object.entries(groupedData).flatMap(([namaSiswa, tagihan]) => [{
                        type: 'header',
                        namaSiswa
                    },
                    ...tagihan.map(t => ({
                        type: 'data',
                        ...t
                    }))
                ]);

                // Set up pagination event listeners
                prevPageBtn.onclick = (e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                        renderPage(currentPage - 1, groupedData, namaSekolah);
                    }
                };

                nextPageBtn.onclick = (e) => {
                    e.preventDefault();
                    const totalPages = Math.ceil(paginatedData.length / itemsPerPage);
                    if (currentPage < totalPages) {
                        renderPage(currentPage + 1, groupedData, namaSekolah);
                    }
                };

                // Initial render
                renderPage(1, groupedData, namaSekolah);
            })
            .catch(error => {
                console.error('Error:', error);
                billingDataKelas.innerHTML = '';
                noDataMessage.style.display = 'block';
                alert(error.message);
            });
    });


   
});