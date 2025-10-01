async function verificar() {
  const query = document.getElementById("texto").value.trim();
  const resultadosDiv = document.getElementById("resultados");

  if (!query) {
    resultadosDiv.innerHTML = "<p class='warning'>⚠ Digite algo para verificar.</p>";
    return;
  }

  resultadosDiv.innerHTML = "<p>Carregando...</p>";

  try {
    const resposta = await fetch(`http://localhost:5000/verificar?q=${encodeURIComponent(query)}`);
    const dados = await resposta.json();

    if (!dados.claims || dados.claims.length === 0) {
      resultadosDiv.innerHTML = "<p class='warning'>⚠ Nenhuma checagem encontrada.</p>";
      return;
    }

    let html = "<h2>Resultados encontrados:</h2>";
    dados.claims.forEach(c => {
      if (c.claimReview && c.claimReview.length > 0) {
        html += `
          <div>
            <p><strong>Afirmação:</strong> ${c.text}</p>
            <p><strong>Classificação:</strong> ${c.claimReview[0].textualRating}</p>
            <p><strong>Fonte:</strong> <a href="${c.claimReview[0].url}" target="_blank">${c.claimReview[0].publisher.name}</a></p>
          </div>
        `;
      }
    });

    resultadosDiv.innerHTML = html;
  } catch (erro) {
    resultadosDiv.innerHTML = "<p class='error'>❌ Erro ao buscar resultados.</p>";
    console.error(erro);
  }
}
