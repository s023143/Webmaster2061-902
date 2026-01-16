function search_resource() {
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName('resource');
    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].style.display = "none";
        }
        else {
            x[i].style.display ="flex";
        }
    }
}

const typeFilter = document.getElementById('typeFilter');

const clearButton = document.getElementById('clearFilters');
const resource = document.querySelectorAll('.resource');

function filterResource() {

  const typeVal = typeFilter.value;


  resource.forEach((resource) => {
     
   
     
    const resourceType = resource.dataset.type;

    let visible = true;



    // TYPE FILTER
    if (typeVal && resourceType !== typeVal) visible = false;


    resource.style.display = visible ? 'flex' : 'none';
   
   
  });
}


typeFilter.addEventListener('change', filterResource);


clearButton.addEventListener('click', () => {

  typeFilter.value = '';

  filterResource();
});

