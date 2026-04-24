document.addEventListener('DOMContentLoaded', function () {
  if (!window.mockData || !mockData.kpiMap) return;

  const kpiSectionsNode = document.getElementById('kpiSections');
  mockData.kpiMap.forEach((kpi) => {
    const section = document.createElement('section');
    section.className = 'kpi-section';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = kpi.title;
    section.appendChild(title);

    const definition = document.createElement('p');
    const definitionLabel = document.createElement('strong');
    definitionLabel.textContent = 'DefiniÃ§Ã£o:';
    definition.appendChild(definitionLabel);
    definition.appendChild(document.createTextNode(' ' + kpi.definition));
    section.appendChild(definition);

    const meta = document.createElement('div');
    meta.className = 'kpi-meta';

    const level2Wrap = document.createElement('div');
    const level2Title = document.createElement('strong');
    level2Title.textContent = 'NÃ­vel 2';
    level2Wrap.appendChild(level2Title);
    const level2List = document.createElement('ul');
    kpi.level2.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      level2List.appendChild(li);
    });
    level2Wrap.appendChild(level2List);
    meta.appendChild(level2Wrap);

    const level3Wrap = document.createElement('div');
    const level3Title = document.createElement('strong');
    level3Title.textContent = 'NÃ­vel 3';
    level3Wrap.appendChild(level3Title);
    const level3List = document.createElement('ul');
    kpi.level3.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      level3List.appendChild(li);
    });
    level3Wrap.appendChild(level3List);
    meta.appendChild(level3Wrap);

    section.appendChild(meta);

    const strategiesWrap = document.createElement('div');
    strategiesWrap.style.marginTop = '0.75rem';
    const strategiesTitle = document.createElement('strong');
    strategiesTitle.textContent = 'EstratÃ©gias:';
    strategiesWrap.appendChild(strategiesTitle);
    const strategiesList = document.createElement('ul');
    kpi.strategies.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      strategiesList.appendChild(li);
    });
    strategiesWrap.appendChild(strategiesList);
    section.appendChild(strategiesWrap);

    kpiSectionsNode.appendChild(section);
  });
});
