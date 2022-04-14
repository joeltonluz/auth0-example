import Swal from 'sweetalert2'

const exibirMsg = (message, title="Auth0 App Test", errorMessage=false) => {
  return Swal.fire({
    title: title,
    text: message,
    icon: errorMessage ? 'error' : 'info'
  })
}

export default exibirMsg;