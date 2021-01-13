import React from 'react';
import {eventToday, getDisplayDayFull,} from "../functions/DateFunctions"
import ApiCalendar from 'react-google-calendar-api';
import pinIcon from "../assets/thumbtack-solid.svg";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import infoIcon from "../assets/info-circle-solid.svg"
import FlipMove from 'react-flip-move';

export default class WeekList extends React.Component {
  render() {
    var minWidthNum;
    if(this.props.nextWeekShow<7){
      minWidthNum = this.props.nextWeekShow/7*1150;
    } else {
      minWidthNum = 1150;
    }
    
    return(
      <div className="week">
        <div className="weekTable">
          <table className="weekList" style={{minWidth:minWidthNum+"px"}}>
            <tbody>
              <tr>
                <WeekListHeader days={this.props.nextWeekShow}/>
              </tr>
              <tr>
                <DayList calendarObjects={this.props.calendarObjects} days={this.props.nextWeekShow} courseColors={this.props.courseColors} updateDone={this.props.updateDone} errorTimeoutOpen={this.props.errorTimeoutOpen} updatePin={this.props.updatePin} darkMode={this.props.darkMode}/>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
function WeekListHeader(props){
  var weekHeaders = [];
  var numDays;
  if(props.days>=7){
    numDays = 7;
  } else {
    numDays=props.days;
  }
  for (var i = 0; i < numDays; i++) {
    if(i===0){
      weekHeaders.push( <th key={i} className="weekday header3 fadeIn">Today</th> )
    } else {
      weekHeaders.push( <th key={i} className="weekday header3 fadeIn">{getDisplayDayFull((new Date()).addDays(i))}</th> )
    }
    
  }
  return weekHeaders;
}

function DayList(props){
  var dayListEntries = [];
  var numDays;
  if(props.days>=7){
    numDays = 7;
  } else {
    numDays=props.days;
  }
  for (var i = 0; i < numDays; i++) {
    dayListEntries.push( 
      <td className="fadeIn">
        <DayListEntry key={i} calendarObjects={props.calendarObjects} dayOffset={i} courseColors={props.courseColors} errorTimeoutOpen={props.errorTimeoutOpen} updateDone={props.updateDone} updatePin={props.updatePin} darkMode={props.darkMode}/>
      </td> 
    )
  }
  return dayListEntries;
}

class DayEntry extends React.Component{
  //Note this code is from the checkoff update accordingly ---------------------------------------------------------
  constructor(props) {
    super(props);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.state ={checked: this.props.done};
  }
  handleItemClick(event: SyntheticEvent<any>, name: string): void {
    if(this.props.calendarIDCurrent==="")
      ApiCalendar.setCalendar("primary")
    else 
      ApiCalendar.setCalendar(this.props.calendarIDCurrent)
    if (name==="checkOff"&&this.props.pin===false) {
      if (ApiCalendar.sign){
        //navigator.vibrate([30]);
        if(this.props.course!==""){
          const event = {
            summary: "✔️" + this.props.course + " " + this.props.name
          };
          ApiCalendar.updateEvent(event, this.props.id)
          .then(
            this.props.updateDone(this.props.id),
          )
          .catch((error: any) => {
            this.props.errorTimeoutOpen("Error 401/404")
          });
        } else {
          const event = {
            summary: "✔️" + this.props.name
          };
          ApiCalendar.updateEvent(event, this.props.id)
          .then(
            this.props.updateDone(this.props.id),
          )
          .catch((error: any) => {
             this.props.errorTimeoutOpen("Error 401/404")
          });
        }
      }
    } else if (name==="uncheckOff") {
      if (ApiCalendar.sign){
        //navigator.vibrate([10]);
        if(this.props.course!==""){
          const event = {
            summary: this.props.course + " " + this.props.name
          };
          ApiCalendar.updateEvent(event, this.props.id)
          .then(
            this.props.updateDone(this.props.id),
          )
          .catch((error: any) => {
            this.props.errorTimeoutOpen("Timeout error")
          });
        } else {
          const event = {
            summary: this.props.name //remove the check-mark, because no check-mark is ever passed in
          };
          ApiCalendar.updateEvent(event, this.props.id)
          .then(
            this.props.updateDone(this.props.id),
          )
          .catch((error: any) => {
            this.props.errorTimeoutOpen("Timeout error")
          });
        }
      }
    }    
    if ((name==="pin"||name==="checkOff")&&this.props.pin===true) {
      if (ApiCalendar.sign){
        //navigator.vibrate([10]);
        if(name==="checkOff"){
          if(this.props.course!==""){
            const event = {
              summary: "✔️" + this.props.course + " " + this.props.name
            };
            ApiCalendar.updateEvent(event, this.props.id)
            .then(
              this.props.updatePin(this.props.id),
              this.props.updateDone(this.props.id),
            )
            .catch((error: any) => {
              this.props.errorTimeoutOpen("Error 401/404")
            });
          } else {
            const event = {
              summary: "✔️" + this.props.name //remove the pin, because no pin is ever passed in
            };
            ApiCalendar.updateEvent(event, this.props.id)
            .then(
              this.props.updatePin(this.props.id),
              this.props.updateDone(this.props.id),
            )
            .catch((error: any) => {
              this.props.errorTimeoutOpen("Error 401/404")
            });
          }
        } else {
          if(this.props.course!==""){
            const event = {
              summary: this.props.course + " " + this.props.name
            };
            ApiCalendar.updateEvent(event, this.props.id)
            .then(
              this.props.updatePin(this.props.id),
            )
            .catch((error: any) => {
              this.props.errorTimeoutOpen("Error 401/404")
            });
          } else {
            const event = {
              summary: this.props.name //remove the pin, because no pin is ever passed in
            };
            ApiCalendar.updateEvent(event, this.props.id)
            .then(
              this.props.updatePin(this.props.id),
            )
            .catch((error: any) => {
              this.props.errorTimeoutOpen("Error 401/404")
            });
          }
        }
        
      }
    } else if (name==="pin"&&(this.props.pin===false&&this.props.done===false)) {
      if (ApiCalendar.sign){
        //navigator.vibrate([30]);
        if(this.props.course!==""){
          const event = {
            summary: "📌" + this.props.course + " " + this.props.name
          };
          ApiCalendar.updateEvent(event, this.props.id)
          .then(
            this.props.updatePin(this.props.id),
          )
          .catch((error: any) => {
            this.props.errorTimeoutOpen("Error 401/404")
          });
        } else {
          const event = {
            summary: "📌" + this.props.name
          };
          ApiCalendar.updateEvent(event, this.props.id)
          .then(
            this.props.updatePin(this.props.id),
          )
          .catch((error: any) => {
            this.props.errorTimeoutOpen("Error 401/404")
          });
        }
      } 
    }
  }
  
  //--------------------------------------------------------------------------------------
  render(){
    var weekTimeLabelMargin=0;
    if((this.props.pinDisplay!=="none" && this.props.descriptionDisplay!=="none")&&this.props.courseDisplay==="none"){
      weekTimeLabelMargin=47;
    } else if(this.props.courseDisplay==="none"){
      weekTimeLabelMargin=15;
    }
    var iconBoxWeekRight="0px";
    var iconBoxWeekBottom="0px";
    if(this.props.courseDisplay==="none"){
      iconBoxWeekRight="-2px";
      iconBoxWeekBottom="-5px";
    }
    var pinClass = "pinIconWeek"
    if(this.props.pin===true){
      pinClass+=" pinInWeek"
    } else {
      pinClass+=" pinOutWeek"
    }
    var weekEntryClass="weekEntry";
    var weekEntryOpacity="1";
    if(this.props.done===true){
      weekEntryClass=weekEntryClass+" weekEntryDone";
      weekEntryOpacity="0.5";
    }
    return(
      <div className={weekEntryClass}>
        <div onClick={(e) => this.handleItemClick(e, this.props.clickActionCheck)} className="weekEventLabel" style={{"color":this.props.checkColor, "textDecoration":this.props.textStyle, "transition":"all 0.5s"}}>{this.props.name}</div>
        <div onClick={(e) => this.handleItemClick(e, this.props.clickActionCheck)} className="weekTimeLabel" style={{"marginRight":weekTimeLabelMargin+"px","opacity":weekEntryOpacity, "transition":"all 0.5s"}}>{this.props.timeStart+this.props.displayTimeEnd}</div>
        <div className="courseBubble" style={{"display":this.props.courseDisplay}}><span style={{"backgroundColor":this.props.courseColor}}>{this.props.course}</span></div>
        <div className="iconBoxWeek fadeIn" style={{"right":iconBoxWeekRight,"bottom":iconBoxWeekBottom}}>
          <img onClick={(e) => this.handleItemClick(e, "pin")} alt="pin" className={pinClass} src={pinIcon} style={{"display":this.props.pinDisplay}}/>
          <OverlayTrigger placement={"bottom"} overlay={<Tooltip><div dangerouslySetInnerHTML={{ __html: this.props.description }}></div></Tooltip>}>
            <img alt="descriptions" className="infoIconWeek" src={infoIcon} style={{"display":this.props.descriptionDisplay, "opacity":weekEntryOpacity}}/>
          </OverlayTrigger>
        </div>
      </div> 
    )
      
  }
}

class DayListEntry extends React.Component{
  
  render(){
    return(
      <FlipMove staggerDelayBy={5} staggerDurationBy={2} easing={"ease"} duration={700} leaveAnimation="none" enterAnimation="none">
        {this.props.calendarObjects.map(function(task){
          var displayTimeEnd;
          if(task.timeEnd==="All day"){
            displayTimeEnd="";
          } else {
            displayTimeEnd=" - "+task.timeEnd;
          }
          var courseDisplay="none";
          if(task.course!==""){
            courseDisplay="";
          }
          
          var descriptionDisplay="none";
          if(task.description!==undefined&&task.description!==null){
            descriptionDisplay="";
          }
          var pinDisplay="none";
          if(task.done===false){
            pinDisplay="";
          }
          var textStyle="none";
          var clickActionCheck="checkOff";
          var checkColor="";
          if(task.done===true){
            textStyle = "line-through";
            clickActionCheck="uncheckOff";
            checkColor="#777777";
          }
          if(task.important===true&&this.props.darkMode===true&&task.done===false){
            checkColor="#ff8b8b"
          } else if (task.important===true&&this.props.darkMode===false&&task.done===false){
            checkColor="#C85000"
          }
          if(task.hide===false&&(eventToday(new Date(task.start.dateTime),(new Date()).addDays(this.props.dayOffset))||eventToday(new Date(task.end.date),(new Date()).addDays(this.props.dayOffset)))){
            return(
              <DayEntry
                key={task.id}
                checkColor={checkColor}
                textStyle={textStyle}
                name={task.name}
                timeStart={task.timeStart}
                displayTimeEnd={displayTimeEnd}
                courseDisplay={courseDisplay}
                courseColor={task.courseColor}
                course={task.course}
                descriptionDisplay={descriptionDisplay}
                description={task.description}
                id={task.id}
                updateDone={this.props.updateDone}
                calendarIDCurrent={task.calendarID}
                done={task.done}
                clickActionCheck={clickActionCheck}
                pin={task.pin}
                updatePin={this.props.updatePin}
                pinDisplay={pinDisplay}
                important={task.important}
                darkMode={this.props.darkMode}
              />
            )
          }
        }, this)}
      </FlipMove>
    )
  }
}
