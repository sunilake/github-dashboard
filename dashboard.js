const events = ['Open Source', 'Conversation --', 'Issues', 'Comments', 'Code --', 'Pushes', 'Releases', 'Forks', 'Wiki', 'Community --', 'Stars', 'Follow', 'Organization admin']
var paginateProgress = 0
init()
updateClasses()

document.addEventListener('change', function (evt) {
  if (evt.target.classList.contains('js-dashboard-filter-checkbox')) {
    updateClasses()
    rememberPreference()
  }
})

function updateClasses() {
  const target = document.querySelector('#dashboard')
  for (const checkbox of document.querySelectorAll('.js-dashboard-filter-checkbox')) {
    target.classList.toggle(`show_${checkbox.id}`, checkbox.checked)
  }
}

function init () {
  const details = document.createElement('details')
  details.classList.add('position-relative', 'mt-3', 'js-dropdown-details', 'details-overlay')
  const summary = document.createElement('summary')
  summary.classList.add('btn')
  summary.innerText = 'Activity filter'
  const container = document.createElement('div')
  container.classList.add('dropdown-menu', 'dropdown-menu-se')
  container.style.width = '200px'

  for (const key of events) {
    var isHeader = key.split(/ --$/)
    if (isHeader.length > 1) {
      var header = document.createElement('div')
      header.textContent = isHeader[0]
      header.classList.add('dropdown-header')
      container.appendChild(header)
      continue
    }
    var id = key.toLowerCase().replace(/\s/g, '_')
    var input = document.createElement('input')
    input.type = 'checkbox'
    input.id = id
    input.className = 'position-absolute my-2 ml-3 js-dashboard-filter-checkbox'

    var label = document.createElement('label')
    label.className = 'pl-6 dropdown-item'
    label.innerText = key
    label.htmlFor = id

    container.appendChild(input)
    container.appendChild(label)
  }
  details.appendChild(summary)
  details.appendChild(container)

  // Personal || Org
  var target = document.querySelector('#dashboard .tabnav')

  if (target) {
    target.insertAdjacentElement('afterend', details)
  } else {
    document.querySelector('.news').prepend(details)
  }
  applyPreference()
}

function rememberPreference () {
  var preference = {}
  for (const box of document.querySelectorAll('.js-dashboard-filter-checkbox')) {
    preference[box.id] = box.checked
  }

  localStorage.setItem('dashboard:select', JSON.stringify(preference))
  loadMoreItemsIfApplicable()
}

function applyPreference () {
  var preference = localStorage.getItem('dashboard:select')
  if (preference) {
    preference = JSON.parse(preference)
  }

  for (const box of document.querySelectorAll('.js-dashboard-filter-checkbox')) {
    box.checked = preference ? preference[box.id] : true
  }

  loadMoreItemsIfApplicable()
}

function loadMoreItemsIfApplicable (looping) {
  var paginateBtn = document.querySelector('#dashboard button.ajax-pagination-btn')
  if (!paginateBtn) { return false }
  if (!looping) { paginateProgress = 0 }
  paginateBtn.click()

  var classes = events.map(function(event){ return event.toLowerCase()}).join(',')
  var visibleItems = Array.prototype.filter.call(document.querySelectorAll(classes), function (ele) {
    return ele.offsetHeight > 0
  })

  if (visibleItems.length < 10) {
    paginateBtn.click()

    // Ugh
    setTimeout(function () {
      if (paginateProgress < 3 && visibleItems.length < 10) {
        paginateProgress++
        loadMoreItemsIfApplicable(true)
      }
    }, 500)
  }
}
