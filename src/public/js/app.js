let currentUserId = null;

const checkForUpdates = async () => {
    try {
        const response = await fetch('/api/v1/user/last-access');
        const data = await response.json();
        
        // Verificar si el ID es nuevo y válido
        if (data.userId && data.userId !== currentUserId) {
            currentUserId = data.userId;
            await performSearch(data.userId);
            
            // Resetear después de 2 segundos
            setTimeout(() => {
                currentUserId = null;
                document.getElementById('resultado').innerHTML = '';
                document.getElementById('cedula').value = '';
            }, 2000);
        }

        
    } catch(error) {
        console.error('Error checking updates:', error);
    }
};

const performSearch = async (userId) => {
    const resultadoDiv = document.getElementById('resultado');
    
    try {
        const response = await fetch(`/api/v1/user/id/${userId}`);
        const user = await response.json();
        
        if (user.length === 0) {
            resultadoDiv.innerHTML = 'Usuario no encontrado';
            resultadoDiv.style.backgroundColor = '#ffebee';
            resultadoDiv.style.color = '#b71c1c';
            return;
        }
        
        resultadoDiv.innerHTML = `
            ${user[0].firstName} ${user[0].lastName}<br>
            Su documento es: ${user[0].id}
        `;
        resultadoDiv.style.backgroundColor = '#e8f5e9';
        resultadoDiv.style.color = '#2e7d32';

        // Mostrar botón al tener resultados
        resultadoDiv.innerHTML = `
        ${user[0].firstName} ${user[0].lastName}<br>
        Su documento es: ${user[0].id}
        `;

        document.getElementById('btnLimpiar').style.display = 'block';

        // Manejar evento del botón
        document.getElementById('btnLimpiar').addEventListener('click', async () => {
            try {
                await fetch('/api/v1/user/clear-access', { method: 'POST' });
                document.getElementById('resultado').innerHTML = '';
                document.getElementById('resultado').style.backgroundColor = '';
                document.getElementById('resultado').style.color = '';
                document.getElementById('btnLimpiar').style.display = 'none';
                document.getElementById('cedula').value = '';
            } catch (error) {
                console.error('Error al limpiar:', error);
            }
});
        
    } catch (error) {
        resultadoDiv.innerHTML = 'Error en la consulta';
        resultadoDiv.style.backgroundColor = '#ffebee';
        resultadoDiv.style.color = '#b71c1c';
    }
};

// Configurar polling cada segundo
setInterval(checkForUpdates, 1000);

document.getElementById('consultaForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cedula = document.getElementById('cedula').value;
    await performSearch(cedula);
});
