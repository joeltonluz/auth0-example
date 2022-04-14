import axios from 'axios';
import ExibirMsg from '../components/ExibirMsg';
import { useAuth0 } from "@auth0/auth0-react";

const ButtonPanel = () => {

  const { 
    loginWithPopup,
    loginWithRedirect, 
    logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently
  } = useAuth0();
  
  const callApi = async() => {
    try {
      const response = await axios.get('http://localhost:4000/')
      await ExibirMsg(response.data)
    }catch(error) {
      await ExibirMsg(error.message, 'ATENÇÃO', true)
    }
  }
  
  const callProtectedApi = async() => {
    try {     
      const token = await getAccessTokenSilently();
      const response = await axios.get('http://localhost:4000/protected/',{
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      console.log(response.data)
      ExibirMsg(JSON.stringify(response.data));
    } catch(error) {
      ExibirMsg(error.message, 'ATENÇÃO', true)
    }
  }

  return (
    <div>
      {isLoading ? <h3>Carregando Informações</h3> :(
        <div>
          <ul>
            {!isAuthenticated ? (
              <div>
                <li><button className="btn login" onClick={loginWithPopup}>Login with Popup</button></li>
                <li><button className="btn login" onClick={loginWithRedirect}>Login with Redirect</button></li>
              </div>
            ) : (
              <div>
                <li><button className="btn logout" onClick={logout}>Logout</button></li>
              </div>
            )}            
          </ul>
          <h3>Usuário {isAuthenticated ? "Logado" : "Não Logado"}</h3>

          <ul>
            <li><button className="btn" onClick={callApi}>Chamar API Pública</button></li>
            <li><button className="btn" onClick={callProtectedApi}>Chamar API Privada</button></li>
          </ul>

          {isAuthenticated && (
            <pre style={{textAlign: 'center'}}>
              {JSON.stringify(user,null, 2)}
            </pre>
          )}
        </div>
      )}
      
    </div>      
  )
}

export default ButtonPanel;