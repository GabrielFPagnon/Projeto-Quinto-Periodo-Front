import { useState } from 'react'
import './App.css'

function App() {
  // Estado para armazenar as entradas do usuário (Inputs)
  const [formData, setFormData] = useState({
    tempoDisponivel: '',
    estadoMental: '',
    objetivo: ''
  });

  // Estado para armazenar a resposta da IA e controle de carregamento
  const [rotinaSugerida, setRotinaSugerida] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');

  // Função para atualizar o estado conforme o usuário digita
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Função para enviar os dados para o Back-end (Integração)
  const gerarRotina = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setIsLoading(true);
    setRotinaSugerida('');
    setErro('');

    try {
      // Chamada para o seu Back-end Node.js na porta 5000
      const resposta = await fetch('http://localhost:5000/api/sugerir-rotina', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const dados = await resposta.json();

      if (dados.sucesso) {
        setRotinaSugerida(dados.rotinaSugerida);
      } else {
        setErro(dados.erro || 'Ocorreu um erro desconhecido.');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setErro('Não foi possível conectar ao servidor. Verifique se o Back-end está rodando na porta 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Micro-Saúde & Foco</h1>
        <p>Inteligência Artificial para sua produtividade mental.</p>
      </header>

      <main>
        <form onSubmit={gerarRotina} className="formulario">
          <div className="campo">
            <label htmlFor="tempoDisponivel">Tempo Disponível (minutos):</label>
            <input
              type="number"
              id="tempoDisponivel"
              name="tempoDisponivel"
              value={formData.tempoDisponivel}
              onChange={handleInputChange}
              placeholder="Ex: 45"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="estadoMental">Como você está se sentindo?</label>
            <input
              type="text"
              id="estadoMental"
              name="estadoMental"
              value={formData.estadoMental}
              onChange={handleInputChange}
              placeholder="Ex: Disperso, ansioso, cansado..."
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="objetivo">Qual o seu objetivo agora?</label>
            <input
              type="text"
              id="objetivo"
              name="objetivo"
              value={formData.objetivo}
              onChange={handleInputChange}
              placeholder="Ex: Estudar Node.js, ler um capítulo..."
              required
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Gerando Rotina...' : 'Gerar Minha Rotina'}
          </button>
        </form>

        {/* Área de Exibição do Resultado (TCB do diagrama GSS) */}
        {(rotinaSugerida || erro || isLoading) && (
          <section className="resultado">
            {isLoading && <p className="status">Aguardando a IA do Gemini...</p>}
            
            {erro && <p className="erro-mensagem">{erro}</p>}
            
            {rotinaSugerida && (
              <>
                <h2>Sua Rotina Personalizada:</h2>
                {/* Usamos pre-wrap para manter a formatação de lista que o Gemini envia */}
                <div className="texto-rotina" style={{ whiteSpace: 'pre-wrap' }}>
                  {rotinaSugerida}
                </div>
              </>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default App