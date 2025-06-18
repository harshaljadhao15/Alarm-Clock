import { LightningElement } from 'lwc';
import AlarmClockAssets from '@salesforce/resourceUrl/AlarmClockAssets'; 
export default class AlarmClock extends LightningElement {

    clockImage = AlarmClockAssets + '/AlarmClockAssets/clock.png';

    ringtone = new Audio(AlarmClockAssets + '/AlarmClockAssets/Clocksound.mp3');
    
    currentTime = '';
    hours = [];
    minutes = [];
    meridian = ['AM', 'PM'];

    isAlarmSet = false;
    alarmTime;
    hourSelected;
    minuteSelected;
    meridianSelected;
    isAlarmTriggered = false;

    get isFieldNotSelected(){
        return !(this.hourSelected && this.minuteSelected && this.meridianSelected);
    }

    get shakeImage(){
        return this.isAlarmTriggered ? 'shake' : '';
    }

    connectedCallback(){
        this.currentTimeHandler();
        this.createHoursOptions();
        this.createMinutesOptions();
    }
    currentTimeHandler(){

        setInterval(()=>{
            let dateTime = new Date();
            let hour = dateTime.getHours();
            let min = dateTime.getMinutes();
            let sec = dateTime.getSeconds();

            let ampm = 'AM'
            
            if(hour === 0){
                hour = 12;
            }else if(hour === 12){
                ampm = 'PM';
            } else if( hour >= 12){
                hour = hour - 12;
                ampm = 'PM';
            }

            hour = hour < 10 ? '0' + hour : hour;
            min = min < 10 ? '0' + min : min;
            sec = sec < 10? '0' + sec : sec;

            this.currentTime = `${hour}:${min}:${sec}  ${ampm}`;
            if(this.alarmTime === `${hour}:${min} ${ampm}`){
                console.log('Alarm Trigger');
                this.isAlarmTriggered = true;
                this.ringtone.play();
                this.ringtone.loop = true ; 
            }

        },1000);
        
    }

    createHoursOptions(){
        for( let i = 1; i <=12 ; i++){
            let value = i < 10 ? '0' + i : i;
            this.hours.push(value);
        }
    }

    createMinutesOptions(){
        for( let i = 0; i <=59 ; i++){
            let value = i < 10 ? '0' + i : i;
            this.minutes.push(value);
        }
    }

    optionHandler(event){
        
        const {label, value} = event.detail;
        if(label ==="Hour(s)"){
            
            this.hourSelected = value;
            
        }else if(label==="Minute(s)"){
            this.minuteSelected = value;
        }else if(label==="AM/PM"){
            this.meridianSelected = value;
        }
        else{
            
        }

        console.log('Hour Selected: ' + this.hourSelected);
        console.log('Min Selected: ' + this.minuteSelected);
        console.log('Meridian Selected: ' + this.meridianSelected);
    }

    setAlarmHandler(){
        this.alarmTime = `${this.hourSelected}:${this.minuteSelected} ${this.meridianSelected}`;
        this.isAlarmSet = true;
    }

    clearAlarmHandler(){
        this.isAlarmSet = false;
        this.alarmTime = '';
        this.isAlarmTriggered = false ; 
        this.ringtone.pause(); 
        const elements = this.template.querySelectorAll('c-clock-dropdown')
        Array.from(elements).forEach(element => {
            element.reset("");
        })
    }
}