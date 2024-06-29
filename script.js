document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const resultsDiv = document.getElementById('results');

  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const query = searchInput.value.trim();
      if (query !== '') {
        fetchData().then(data => {
          const filteredData = filterData(data, query);
          displayResults(filteredData);
        });
      } else {
        alert('Please enter a search query.');
      }
    });
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
      fetchData().then(data => {
        const filteredData = filterData(data, query);
        displayResults(filteredData);
      });
    } else {
      resultsDiv.textContent = 'No search query provided.';
    }
  }
  
  async function fetchData() {
    const response = await fetch('food_data.csv');
    const data = await response.text();
    return data;
  }

  function filterData(data, query) {
    const rows = data.split('\n');
    const filteredRows = rows.filter(row => {
      const rowData = row.split(',');
      return rowData[0].toLowerCase().includes(query.toLowerCase());
    });
    return filteredRows;
  }

  function displayResults(results) {
    resultsDiv.innerHTML = '';

    if (results.length === 0) {
      const noResultsItem = document.createElement('div');
      noResultsItem.textContent = 'No matching items found.';
      resultsDiv.appendChild(noResultsItem);
    } else {
      const uniqueItems = {};

      results.forEach(row => {
        const rowData = row.split(',');
        const itemName = rowData[0].trim();
        const itemDetails = parseItemDetails(rowData);

        if (!uniqueItems[itemName]) {
          uniqueItems[itemName] = itemDetails;
        } else {
          uniqueItems[itemName].details.push(...itemDetails.details);
        }
      });


      Object.values(uniqueItems).forEach(itemDetails => {
        const itemElement = createItemElement(itemDetails);
        resultsDiv.appendChild(itemElement);
      });
    }
  }

 
  function parseItemDetails(rowData) {
    const itemDetails = {
      name: rowData[0],
      details: []
    };

    for (let i = 1; i < rowData.length; i++) {
   
      const parts = rowData[i].split(':');
      if (parts.length === 2) {
        let detail = `<b>${parts[0].trim()}</b>: ${parts[1].trim()}`;
        itemDetails.details.push(detail);
      } else {

        itemDetails.details.push(rowData[i].trim());
      }
    }

    return itemDetails;
  }

 
  function createItemElement(itemDetails) {
    const itemContainer = document.createElement('div');
    itemContainer.classList.add('item-container');

    const googleLink = document.createElement('a');
    googleLink.href = `https://www.google.com/search?q=${encodeURIComponent(itemDetails.name)}`;
    googleLink.target = '_blank'; 
    googleLink.textContent = itemDetails.name;
    googleLink.style.fontWeight = 'bold';
    googleLink.style.textDecoration = 'none'; 
    googleLink.style.display = 'block';
    googleLink.style.marginBottom = '10px'; 

    itemContainer.appendChild(googleLink);

    const detailsContainer = document.createElement('div');
    itemDetails.details.forEach(detail => {
      const detailPara = document.createElement('p');
      detailPara.innerHTML = detail; 
      detailsContainer.appendChild(detailPara);
    });
    itemContainer.appendChild(detailsContainer);

    return itemContainer;
  }
});