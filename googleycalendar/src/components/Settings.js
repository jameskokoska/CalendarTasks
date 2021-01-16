import React from 'react';
import ApiCalendar from 'react-google-calendar-api';
import { AsyncStorage } from 'AsyncStorage';
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import settingsIcon from "../assets/cog-solid.svg"
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import ColorPicker from "./ColorPicker"
import '../App.css';
import ButtonStyle from "./ButtonStyle"

export default class Settings extends React.Component{
  constructor(props) {
    super(props);
    this.state ={settingsOpen: false, signStatus: this.props.signStatus};
  }

  handleItemClick(event: SyntheticEvent<any>, name: string): void {
    if (name === 'openSettings') {
      this.setState({
        settingsOpen: true,
      })
    } else if (name==='closeSettings') {
      //Reload events on exit of settings
      this.props.resetCalendarObjects();
      this.setState({
        settingsOpen: false,
      })
    } else if (name === 'signInOut') {
      if(this.props.signStatus){
        ApiCalendar.handleSignoutClick();
      } else {
        ApiCalendar.handleAuthClick();
      }
    }
  }

  handleChange(event,props) {
    if(event.target.name==="resetPomoStats"){
      AsyncStorage.setItem('pomoTotalSec', 0);
      this.setState({
        settingsOpen: false,
      })
    }
  }

  render(){
    var signInOutLabel;
    if(this.props.signStatus){
      signInOutLabel = "Logout"
    } else {
      signInOutLabel = "Login"
    }

    if(global.settings===undefined){
      global.settings=settingsOptions;
    }
    if(global.settingsColour===undefined){
      global.settingsColour=settingsOptionsColour();
    }
    
    return(
      <div>
        <img alt="open settings" onClick={(e) => this.handleItemClick(e, "openSettings")} src={settingsIcon} className="settingsIcon"/>
        <Modal show={this.state.settingsOpen} onHide={(e) => this.handleItemClick(e, "closeSettings")} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Settings</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {global.settings.map( (setting, index)=>
                {return <SettingsContainer setting={setting}/>}
              )}
              <Form.Group>
                <Button name="resetPomoStats" variant="outline-secondary" onClick={(e) => {this.handleChange(e, this.props)}}>
                  Reset Pomodoro Stats
                </Button>
              </Form.Group>

              <Accordion defaultActiveKey="10">
                <Card>
                  <Card.Header style={{"padding":"4px"}}>
                    <Accordion.Toggle as={Button} variant="outline-primary" eventKey="0">
                      ▼ Set custom course colours... 
                    </Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <div>
                      {global.settingsColour.map( (settingColour, index)=>
                        {return <SettingsContainerColor settingColour={settingColour}/>}
                      )}
                    </div>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
            </Form>
            <p><b>Course codes</b> have the following format; at the beginning of an event name: "XXX999" or "XXXY999". <br/>3 letters or 4 letters followed by 3 numbers.</p>
            <p>You can <b>sort</b> each category by clicking each category header.</p>
            <p>Closing settings will reload the calendar.</p>
            <p>
              This project is open source, feel free to check out the code here: <a href="https://github.com/jameskokoska/GoogleyCalendar">https://github.com/jameskokoska/GoogleyCalendar</a> 
              <Form.Text style={{"float":"right"}}className="text-muted">
                {"v"+global.version}
              </Form.Text>
            </p>
           
          </Modal.Body>
          <Modal.Footer>
            <div onClick={(e) => this.handleItemClick(e, "signInOut")} style={{"left":"5px","position":"absolute"}}>
              <ButtonStyle label={signInOutLabel}/>
            </div>
            <Button variant="secondary" onClick={(e) => this.handleItemClick(e, "closeSettings")}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

class SettingsContainerColor extends React.Component{
  render(){
    return(
      <Form.Group style={{"paddingTop":"5px","paddingBottom":"3px", "paddingLeft":"10px","paddingRight":"10px"}}>
        <Form.Label>{this.props.settingColour.course + " course color"}</Form.Label>
        <ColorPicker color={this.props.settingColour.currentValue} courseStorageID={this.props.settingColour.keyName}/>
      </Form.Group>
    )
  }
}

class SettingsContainer extends React.Component{
  handleChange(form, key, checked) {
    if(checked===true)
      AsyncStorage.setItem(key, form.target.checked);
    else 
      AsyncStorage.setItem(key, form.target.value);
  }
  render(){
    if(this.props.setting.type==="text"){
      return(
        <Form.Group>
          <Form.Label>{this.props.setting.title}</Form.Label>
          <Form.Control onChange={(form) => {this.handleChange(form,this.props.setting.keyName)}} placeholder={this.props.setting.placeHolder} defaultValue={this.props.setting.currentValue}/>
          <Form.Text className="text-muted">
            {this.props.setting.description}
          </Form.Text>
        </Form.Group>
      )
    } else if(this.props.setting.type==="textDouble"){
      return(
        <Form.Group>
          <Form.Label>{this.props.setting.title}</Form.Label>
          <div>
            <Form.Control onChange={(form) => {this.handleChange(form,this.props.setting.keyName1)}} placeholder={this.props.setting.placeHolder1} defaultValue={this.props.setting.currentValue1} style={{width:"70px", display:"inline-block", marginLeft:"0px", marginRight:"5px"}}/>
            {this.props.setting.subtitle1}
            <Form.Control onChange={(form) => {this.handleChange(form,this.props.setting.keyName2)}} placeholder={this.props.setting.placeHolder2} defaultValue={this.props.setting.currentValue2} style={{width:"70px", display:"inline-block", marginLeft:"20px", marginRight:"5px"}}/>
            {this.props.setting.subtitle2}
          </div>
          <Form.Text className="text-muted">
            {this.props.setting.description}
          </Form.Text>
        </Form.Group>
      )
    } else if(this.props.setting.type==="check"){
      return(
        <Form.Group>
          <Form.Check type="checkbox" label={this.props.setting.title} onChange={(form) => {this.handleChange(form,this.props.setting.keyName, true)}} defaultChecked={this.props.setting.currentValue==="true"}/>
          <Form.Text className="text-muted">
            {this.props.setting.description}
          </Form.Text>
        </Form.Group>
      )
    } else {
      return <div/>
    }
  }
}

export function getSettingsValue(keyName){
  var settingsList = global.settings;
  if(settingsList===undefined)
    return 0;
  for(var x = 0; x<settingsList.length;x++){
    if(settingsList[x].keyName===keyName){
      if(settingsList[x].currentValue==="true"||settingsList[x].currentValue==="false"){
        return settingsList[x].currentValue==="true"
      }
      return settingsList[x].currentValue;
    }
  }

  settingsList = global.settingsColour;
  if(settingsList===undefined)
    return 0;
  for(var x = 0; x<settingsList.length;x++){
    if(settingsList[x].keyName===keyName){
      return settingsList[x].currentValue;
    }
  }
  return 0;
}


export const settingsOptionsColour = () => {
  if(global.courses===undefined||global.courses===[]){
    return [];
  }
  var courses = global.courses;
  var settingsOptionColour = [];
  
  for(var x = 0; x<courses.length;x++){
    var currentColour = {};
    currentColour.keyName = "courseColor"+courses[x];
    currentColour.currentValue = "";
    currentColour.course = courses[x]
    settingsOptionColour.push(currentColour)
  }
  return settingsOptionColour
}

export const settingsOptions = [
  {
    "keyName" : "calendarID",
    "defaultValue" : "primary",
    "currentValue" : "",
    "title" : "Calendar ID",
    "placeHolder" : "example@group.calendar.google.com",
    "description" : "By keeping this blank, it will be the default calendar.",
    "type" : "text" //type is either text, textDouble, check, 
  },
  {
    "keyName" : "calendarID2",
    "defaultValue" : "",
    "currentValue" : "",
    "title" : "Calendar ID 2",
    "placeHolder" : "example@group.calendar.google.com",
    "description" : "By keeping this blank, it will not attempt to load a second calendar.",
    "type" : "text"
  },
  {
    "keyName" : "calendarID3",
    "defaultValue" : "",
    "currentValue" : "",
    "title" : "Calendar ID 3",
    "placeHolder" : "example@group.calendar.google.com",
    "description" : "By keeping this blank, it will not attempt to load a third calendar.",
    "type" : "text" 
  },
  {
    "keyName" : "numEvents",
    "defaultValue" : "500",
    "currentValue" : "",
    "title" : "Number of events to load",
    "placeHolder" : "",
    "description" : "The number of events to load from your calendar.",
    "type" : "text" 
  },
  {
    "keyName" : "hoursBefore",
    "defaultValue" : "24",
    "currentValue" : "",
    "title" : "Number of hours before to load",
    "placeHolder" : "24",
    "description" : "The number of hours before the current time to load events from.",
    "type" : "text" 
  },
  {
    "keyName" : "nextWeekShow",
    "defaultValue" : "7",
    "currentValue" : "",
    "title" : "Number of days to view",
    "placeHolder" : "7",
    "description" : "The number of days of events to display in the Task List.",
    "type" : "text" 
  },
  {
    "keyName" : "skipWeeks",
    "defaultValue" : "true",
    "currentValue" : "",
    "title" : "Day View: scroll through weeks",
    "description" : "Day View arrows skip through weeks instead of single days",
    "type" : "check"
  },
  {
    "keyName" : "autoDark",
    "defaultValue" : "true",
    "currentValue" : "",
    "title" : "Auto dark mode",
    "description" : "Changes the colour theme automatically based on the time of day.",
    "type" : "check" 
  },
  {
    "keyName" : "darkMode",
    "defaultValue" : "false",
    "currentValue" : "",
    "title" : "Dark mode",
    "description" : "Toggles between light and dark modes. Ensure 'auto Dark Mode' is off.",
    "type" : "check" 
  },
  {
    "keyName" : "enableAnimations",
    "defaultValue" : "true",
    "currentValue" : "",
    "title" : "Enable animations",
    "description" : "Enables animations of the lists when they are loaded",
    "type" : "check" 
  },
  {
    "keyName" : "importantEvents",
    "defaultValue" : "",
    "currentValue" : "",
    "title" : "Important events",
    "placeHolder" : "Test,Exam,Quiz",
    "description" : "Events to highlight in the list, separate with comma.",
    "type" : "text" 
  },
  {
    "keyName" : "hideEvents",
    "defaultValue" : "",
    "currentValue" : "",
    "title" : "Hide events",
    "placeHolder" : "LEC,boring,not important,noshow",
    "description" : "Events to hide from the task list, separate with comma (CaSe sEnSiTIvE). If the event name contains any part of this, it will be hidden.",
    "type" : "text" 
  },
  {
    "keyName1" : "workMinutes",
    "keyName2" : "workSeconds",
    "defaultValue1" : "25",
    "defaultValue2" : "0",
    "currentValue1" : "",
    "currentValue2" : "",
    "title" : "Pomodoro timer work session",
    "subtitle1" : "minutes",
    "subtitle2" : "seconds",
    "placeHolder1" : "5",
    "placeHolder2" : "0",
    "description" : "Set the time for work sessions for the pomodoro timer.",
    "type" : "textDouble" 
  },
  {
    "keyName1" : "breakMinutes",
    "keyName2" : "breakSeconds",
    "defaultValue1" : "5",
    "defaultValue2" : "0",
    "currentValue1" : "",
    "currentValue2" : "",
    "title" : "Pomodoro timer break session",
    "subtitle1" : "minutes",
    "subtitle2" : "seconds",
    "placeHolder1" : "5",
    "placeHolder2" : "0",
    "description" : "Set the time for break sessions for the pomodoro timer.",
    "type" : "textDouble" 
  },
  {
    "keyName" : "pomoSound",
    "defaultValue" : "true",
    "currentValue" : "",
    "title" : "Pomodoro sound",
    "description" : "Play a sound when a break or work session ends.",
    "type" : "check" 
  },
]
