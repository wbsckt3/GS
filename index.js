/*
<script src="https://accounts.google.com/gsi/client" async defer></script>
<a href="#register">
	<!-- Google Sign-In -->
	<div id="g_id_onload"
			 data-client_id="980822676255-vntch0t28qbesul2bp5oc1galtoi8a97.apps.googleusercontent.com"
			 data-callback="handleCredentialResponse"
			 data-context="use"
			 data-ux_mode="popup"
			 data-auto_select="true"
			 data-itp_support="true">
	</div>
	<div class="g_id_signin"
			 data-type="standard"
			 data-shape="rectangular"
			 data-theme="outline"
			 data-text="signin_with"
			 data-size="large"
			 data-logo_alignment="left">
	</div>
</a>
*/

function handleCredentialResponse(response) {
           // decodeJwtResponse() is a custom function defined by you
           // to decode the credential response.
           const responsePayload = decodeJwtResponse(response.credential);
           console.log("ID: " + responsePayload.sub);
           console.log('Full Name: ' + responsePayload.name);
           console.log('Given Name: ' + responsePayload.given_name);
           console.log('Family Name: ' + responsePayload.family_name);
           console.log("Image URL: " + responsePayload.picture);
           console.log("Email: " + responsePayload.email);
           const email = responsePayload.email;
           getUserByEmail(email);
           const FullName = responsePayload.name;
	   const GivenName = responsePayload.given_name;
	   const FamilyName = responsePayload.family_name;
           const timestampHoy = new Date().getTime();
           const fechaHoy = new Date(timestampHoy);
           /*const year = fechaHoy.getFullYear();
	   const month = (fechaHoy.getMonth() + 1).toString().padStart(2, '0'); // getMonth() devuelve 0-11, sumamos 1 y rellenamos con 0
           const day = fechaHoy.getDate().toString().padStart(2, '0'); // getDate() devuelve el dï¿½a del mes, rellenamos con 0*/
           const year  = '1970'
           const month = '01'
           const day   = '01'
           const FechaIngreso = `${year}-${month}-${day}`;	   
           const ImageURL = responsePayload.picture;
	   const Email = responsePayload.email;
	   const formData = {
	      FullName,
	      GivenName,
	      FamilyName,
	      FechaIngreso,
	      ImageURL,
	      Email
	   };
           localStorage.setItem("formData", JSON.stringify(formData));     
      }

      // formato de token : JWT header.payload.signature en base64url.
      /*
         {
  	    "header": {
               "alg": "HS256",
               "typ": "JWT"
            },
            "payload": {
               "_id": "12345"
            },
            "signature": "abc123..."
         }
      */

function decodeJwtResponse(token) {
   var base64Url = token.split('.')[1];
   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
   }).join(''));
   return JSON.parse(jsonPayload);
}

async function getUserByEmail(email) {
    		try {
                const response = await fetch(`https://www.refactorii.com/getOneGoogleSigninUser/${email}`, {
            		method: 'GET',  // Use GET method for passing data in the URL
            		headers: {
                	   'Content-Type': 'application/json',
            		},
       		   });
                   if (!response.ok) {
                     const formData = JSON.parse(localStorage.getItem("formData"));
                     const nuevoRegistro = await agregarNuevoRegistro(formData);
                     if (nuevoRegistro) {
                       console.log('Registro creado exitosamente:', nuevoRegistro);
                       window.location.href = 'https://wbsckt3.github.io/gsg_data/index2.html';                  
                     } else {
                       console.error('Error al crear el registro.');
                     }
                     return null;
                  } else {
                    const data = await response.json();
                    if (data.GoogleSigninUser) {
                       window.location.href = '/courses';
                       return data.GoogleSigninUser;
                    } else {
                      return null;
                    }
                  }                
        } catch (error) {
                   console.error('Error:', error);
                   return null;
        }
}

async function agregarNuevoRegistro(registro){
         try {
            const response = await fetch('https://www.refactorii.com/postOneGoogleSigninUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(registro),
          });
          if (!response.ok) {
            throw new Error('Error en la solicitud');
          }
          const data = await response.json();
          return data.GoogleSigninUser; 
         } catch (error) {
          console.error('Error:', error);
          return null;
         }
}



