export default function ForegroundChange(nameClass, duration, type) {
    let foreground = document.getElementsByClassName(nameClass)[0]
    let start = "rgba(0, 0, 0, 0)"
    let end = "rgba(0, 0, 0, 0.555)"
    let toggle = [{ backgroundColor: start }, { backgroundColor: end }]
    let disable = [{ backgroundColor: end }, { backgroundColor: start }]
    let options = { "duration": duration }
    let style = getComputedStyle(foreground)
    console.log(style.getPropertyValue("background-color"), start)
    if (type === "darken") {
        if (style.getPropertyValue("background-color") !== end) {
            foreground.animate(toggle, options)
            foreground.style.backgroundColor = end
        }
    } else {
        if (style.getPropertyValue("background-color") !== start) {
            foreground.animate(disable, options)
            foreground.style.backgroundColor = start
        }
    }


}

// export function ForegroundTransparent(props) {
//     console.log(document.getElementsByClassName("foreground"))
// }