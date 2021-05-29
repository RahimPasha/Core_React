import React, {useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../API/agent';

function App() {
  const [activities, setActivies] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  

  useEffect(()=> {
    agent.Activities.list().then(response => {
      //console.log(Response);
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivies(activities);
    })
  }, [])

  function handleSelectActivity(id: string){
    setSelectedActivity(activities.find(x=>x.id === id));
  }
  function handleCancelSelectActivity(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleCreateOrEditActivity(activity: Activity){
    activity.id ? setActivies([...activities.filter(x=> x.id !== activity.id),activity])
    : setActivies([...activities, {...activity, id:uuid()}]);

    setEditMode(false);
    setSelectedActivity(activity);
  }

  function handleDeleteActivity(id: string){
    setActivies([...activities.filter(x=>x.id != id)]);
  }


  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop: '7em'}}>
      <ActivityDashboard 
      activities={activities}
      selectedActivity={selectedActivity}
      selectActivity = {handleSelectActivity}
      cancelSelectActivity={handleCancelSelectActivity}
      editMode={editMode}
      openForm={handleFormOpen}
      closeForm={handleFormClose}
      createOrEdit={handleCreateOrEditActivity}
      deleteActivity={handleDeleteActivity}
      />
      </Container>

    </>
  );
}

export default App;
