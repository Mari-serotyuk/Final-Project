import { api } from "./API";

export class Task {
    constructor({
        name, 
        description,
        timeTracked,
        isActive,
        isFinished,
        _id,
        createdAt,
    }) {
        this.name = name;
        this.description = description;
        this.timeTracked = timeTracked;
        this.isActive = isActive;
        this.isFinished = isFinished;
        this.createdAt = new Date(createdAt);

        this.id = _id;

        this.taskCard = document.createElement('div');
        this.deleteButton = document.createElement('button');
        this.timerButton = document.createElement('button');
        this.timeTrackedElement = document.createElement('span');
        this.markDoneButton = document.createElement('button');
        this.timeTrackedIntervalId = null;
    }

    renderCard(container){
        const titleElem = document.createElement('h3');
        const descriptionElem = document.createElement('p');
        const timeTracker = document.createElement('div');
        const dateElement = document.createElement('p');

        titleElem.classList.add('task-title');
        descriptionElem.classList.add('task-description');
        timeTracker.classList.add('time-tracker');
        dateElement.classList.add('date-task');

        this.taskCard.classList.add('task-card');
        this.deleteButton.classList.add('button-task-delete');
        this.timerButton.classList.add('time-button');
        this.markDoneButton.classList.add('button', 'button-form', 'button-small');

        if(this.isFinished){
            this.timerButton.setAttribute('disabled', '');
            this.taskCard.classList.add('task-finished');
            this.markDoneButton.innerText = 'Restart';
        }else{
            this.timerButton.classList.add(
                this.isActive ? 'button-stop' : 'button-play'
            );
            this.markDoneButton.innerText = 'Mark as done';
        }

        titleElem.innerText = this.name;
        descriptionElem.innerText = this.description;

        dateElement.innerText = Task.getFormattedDate(this.createdAt);
        this.timeTrackedElement.innerText = Task.getFormattedTimeTracked(
            this.timeTracked
        );


        this.deleteButton.innerHTML = '<i class="fa fa-times"></i>';

        if(this.isActive){
            this.startTracker()
            this.timerButton.innerHTML = `<i class="fa fa-pause"></i>`;
        }else{
            this.timerButton.innerHTML = `<i class="fa fa-play"></i>`
        }


        timeTracker.append(this.timerButton, this.timeTrackedElement);

        this.taskCard.append(
            titleElem,
            descriptionElem,
            timeTracker,
            dateElement,
            this.markDoneButton,
            this.deleteButton
        );

        container.append(this.taskCard);

        this.timerButton.addEventListener('click', this.toggleTimeTracker);
        this.deleteButton.addEventListener('click', this.removeTask);
        this.markDoneButton.addEventListener('click', this.toggleTaskFinished);
    };
 
    removeTask = async() => {
        await api.deleteTask(this.id);
        this.taskCard.remove();
    };

    toggleTaskFinished = async() => {
        this.isFinished = !this.isFinished;

        await api.editTask(this.id, {isFinished: this.isFinished});

        this.taskCard.classList.toggle('task-finished');
        if(this.isFinished){
            this.timerButton.setAttribute('disabled', '');
            this.markDoneButton.innerText = 'Restart';
            this.stopTracker();
        }else{
            this.timerButton.removeAttribute('disabled');
            this.markDoneButton.innerText = 'Mark as done';
        }
    };

    toggleTimeTracker = async () => {
        this.isActive = !this.isActive;

        await api.editTask(this.id, {isActive: this.isActive});

        if(this.isActive){
            this.startTracker()
        }else{
            this.stopTracker()
        }
    };

    startTracker(){
        this.timerButton.classList.remove('button-play');
        this.timerButton.classList.add('button-stop');
        this.timerButton.innerHTML = `<i class="fa fa-pause"></i>`;

        this.timeTrackedIntervalId = setInterval(() => {
            this.timeTracked += 1000;
            this.updateTimeTracker()
        }, 1000)
    }; 

    stopTracker(){
        this.timerButton.classList.add('button-play');
        this.timerButton.classList.remove('button-stop');
        this.timerButton.innerHTML = `<i class="fa fa-play"></i>`;

        clearInterval(this.timeTrackedIntervalId);
    };

    updateTimeTracker(){
        const formatted = Task.getFormattedTimeTracked(this.timeTracked);
        this.timeTrackedElement.innerText = formatted;
    };

    static getFormattedDate(d){
        const date = d.toLocaleDateString();
        const time = d.toLocaleTimeString();

        return `${date} ${time}`
    }

    static addOptionalZero(value){
        return value > 9 ? value : `0${value}`;
    }

    static getFormattedTimeTracked(timeTracked){
        const timeTrackedSeconds = Math.floor(timeTracked / 1000);
        const hours = Math.floor(timeTrackedSeconds / 3600);
        const minutes = Math.floor((timeTrackedSeconds - hours * 3600) / 60);
        const seconds = timeTrackedSeconds - hours * 3600 - minutes * 60;

        return `${this.addOptionalZero(hours)}:${this.addOptionalZero(
            minutes
        )}:${this.addOptionalZero(seconds)}`;
    }
}