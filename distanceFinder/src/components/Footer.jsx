import "../assets/footer.css"

function Footer() {
    const year = new Date().getFullYear()
    return(
        <footer>
            <h5>Copyright ©️ {year}</h5>
        </footer>
    );
}

export default Footer;