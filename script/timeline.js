/* So i dont foregt
 * development: blue
 * information: gray
 * issue: red
 * achievement: green
 * update: purpel */

const timelineEntries = [
  {
    date: "2026-11-02",
    category: "information",
    title: "Still in planning",
    description: "Document with all the stats, quests, skills, etc.. is still being written",
  },
  {
    date: "2026-10-23",
    category: "information",
    title: "Concept",
    description: "The concept for this plugin was developed",
  },
];

const timelineCategories = {
  development: "Development",
  information: "Information",
  issue: "Issue",
  achievement: "Achievement",
  update: "Update",
};

const parseTimelineDate = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));

  if (!match) {
    return null;
  }

  const [, year, month, day] = match;
  const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

  return parsedDate.getFullYear() === Number(year) &&
    parsedDate.getMonth() === Number(month) - 1 &&
    parsedDate.getDate() === Number(day)
    ? parsedDate
    : null;
};

const renderTimeline = () => {
  const timelineContainer = document.querySelector("#timeline-entries");

  if (!timelineContainer) {
    return;
  }

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const sortedEntries = timelineEntries
    .map((entry, index) => ({ entry, index, parsedDate: parseTimelineDate(entry.date) }))
    .sort((first, second) => {
      const firstTime = first.parsedDate ? first.parsedDate.getTime() : Number.NEGATIVE_INFINITY;
      const secondTime = second.parsedDate ? second.parsedDate.getTime() : Number.NEGATIVE_INFINITY;

      return secondTime - firstTime || first.index - second.index;
    });

  const timelineFragment = document.createDocumentFragment();

  if (sortedEntries.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "timeline-empty";
    emptyMessage.textContent = "New informations soon";
    timelineFragment.append(emptyMessage);
  }

  sortedEntries.forEach(({ entry, parsedDate }) => {
    const category = timelineCategories[entry.category] ? entry.category : "information";
    const article = document.createElement("article");
    const date = document.createElement("p");
    const marker = document.createElement("span");
    const markerCore = document.createElement("span");
    const panel = document.createElement("div");
    const categoryLabel = document.createElement("span");
    const title = document.createElement("h2");

    article.className = `timeline-entry timeline-entry--${category}`;
    date.className = "timeline-entry-date";
    marker.className = "timeline-entry-marker";
    markerCore.className = "timeline-entry-marker-core";
    panel.className = "timeline-entry-panel";
    categoryLabel.className = "timeline-entry-category";
    title.className = "timeline-entry-title";

    if (parsedDate) {
      const time = document.createElement("time");
      time.dateTime = String(entry.date);
      time.textContent = dateFormatter.format(parsedDate);
      date.append(time);
    } else {
      date.textContent = String(entry.date || "Date to be announced");
    }

    marker.setAttribute("aria-hidden", "true");
    marker.append(markerCore);
    categoryLabel.textContent = timelineCategories[category];
    title.textContent = String(entry.title || "Project update");
    panel.append(categoryLabel, title);

    if (entry.description) {
      const description = document.createElement("p");
      description.className = "timeline-entry-description";
      description.textContent = String(entry.description);
      panel.append(description);
    }

    article.append(date, marker, panel);
    timelineFragment.append(article);
  });

  timelineContainer.replaceChildren(timelineFragment);
};

document.addEventListener("DOMContentLoaded", renderTimeline);