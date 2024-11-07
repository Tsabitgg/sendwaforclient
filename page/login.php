<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="../assets/img/Logo_512.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <link href="../src/output.css" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Login</title>
</head>

<body class="h-full bg-slate-400 font-inter">
    <div id="notification" class="fixed top-4 right-4 z-50"></div>
    <div class="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-6">
            <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                <div class="flex items-center justify-center space-x-3">
                    <img class="h-12 w-auto" src="../assets/img/Logo_512.png" alt="Your Company">
                    <span class="text-lg font-bold">SEND WHATSAPP</span>
                </div>
                <h2 class="mt-10 text-center text-2xl font-semibold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
            </div>

            <div class="mt-7 sm:mx-auto sm:w-full sm:max-w-sm">
                <form class="space-y-6" action="../Config/auth.php" method="POST" onsubmit="handleSubmit(event)">
                    <div>
                        <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div class="mt-2">
                            <input id="username" name="username" required type="text" autocomplete="username" placeholder="username" class="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                        </div>
                    </div>

                    <div>
                        <div>
                            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div class="relative mt-2">
                                <input id="password" name="password" required type="password" autocomplete="current-password" placeholder="password" class="block w-full rounded-md border-0 py-1.5 pr-10 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                <button id="togglePassword" type="button" class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer focus:outline-none">
                                    <span class="toggle-password" data-target="passdb">
                                        <svg id="eyeIcon" class="eye-open h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>
                                        <svg class="eye-closed h-5 w-5 text-gray-500 hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <!-- <div class="mt-2 text-end text-blue-600 text-sm hover:underline">
                                <a href="resetPassword.php">Lupa Password ?</a>
                            </div> -->
                    </div>

                    <div>
                        <button id="loginButton" type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mb-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="../js/s_scriptLogin.js">
    </script>
    <script>
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        const eyeIconOpen = document.querySelector('.eye-open');
        const eyeIconClosed = document.querySelector('.eye-closed');

        togglePassword.addEventListener('click', function() {
            // Toggle the type attribute
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle icon visibility
            eyeIconOpen.classList.toggle('hidden');
            eyeIconClosed.classList.toggle('hidden');
        });
    </script>
</body>

</html>