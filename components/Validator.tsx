
export function validateEmail(email: string) { // Checks if email is valid using regex
    if (email === undefined || email === null || email.trim.length === 0) {
        return false;
    }
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ); //Regex for email validation
};

export function validatePassword(password: string) { // Checks if password is valid using regex
    if (password === undefined || password === null || password.trim.length === 0) {
        return false;
    }
    return password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/ // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
    ); //Regex for password validation
};