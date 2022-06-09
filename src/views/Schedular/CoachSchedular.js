import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router';
import { connect } from 'react-redux';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import { toast } from 'react-toastify';
import AvailableTimes from "react-available-times";
import { beforeSchedluar, getCoachSchedular, createCoachSchedular } from './CoachSchedular.action'

const CoachSchedular = (props) => {
    var coachId = props.match.params.id;
    const [ coachSchedules, setCoachSchedules ] = useState([]);
    const [loader, setLoader] = useState(false);
    const history = useHistory();

    useEffect(() => {
      toast.dismiss();
      window.scroll(0, 0);
      props.beforeSchedluar()
      props.getCoachSchedular(coachId);
    }, [])

    useEffect(async () => {
      if (props.coachSchedules.getSchedularAuth) {
        let {selections} = await props.coachSchedules?.getSchedular;
        setCoachSchedules(selections)
      }
  }, [props.coachSchedules.getSchedularAuth, props.coachSchedules.getSchedular])

  useEffect(() => {
    if ( coachSchedules ) {
      props.beforeSchedluar()
      setLoader(false)
    }
  }, [coachSchedules])

  let selectedDateTime = [];
  const addSlot = () => {
    props.createCoachSchedular({
      selections: coachSchedules,
      coachId:coachId
    })
    selectedDateTime = [];
    setCoachSchedules([]);
    history.push(`/schedular/view/${coachId}`)
  }
  return (
    <>
      { loader ? <FullPageLoader/> :
      <div className='schedular'>
        <AvailableTimes
          weekStartsOn="monday"
          initialSelections={
            coachSchedules && coachSchedules.length ? 
            coachSchedules.map((data) => 
              ({ start:new Date(data?.start), end:new Date(data?.end) })
            )
            :
            [{ start:null, end:null }]
          }
          calendars={[
            {
              id: "appointment",
              title: "Appointment",
              foregroundColor: "#f000ff",
              backgroundColor: "#f0f0f0",
              selected: true
            }
          ]}
          onChange={ selections => {
            const validSelections = selections
              .filter(
                selection => selection.start != null && selection.end != null
              )
            selectedDateTime = [...validSelections];
            setCoachSchedules(
              [...selectedDateTime],
            )
            console.log(`onchange values--->`, coachSchedules)
          }}
          onEventsRequested={({ calendarId, start, end, callback }) => {
            return true; //
          }}
          recurring={false}
          availableDays={["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]}
          availableHourRange={{ start: 8, end: 20 }}
        />
        <button
          style={{
            position: "absolute",
            top: "96px",
            left: "5%",
            padding: "0.7em",
            borderRadius: "10px",
            backgroundColor: "#d32986",
            outline: "none",
            border: "1px solid #BBB",
            boxShadow: "none",
            color:"#ffff"
          }}
          onClick={() => 
          addSlot(coachSchedules)
          }
        >
          Submit
        </button>
      </div>}
    </>
  );
}
const mapStateToProps = state => ({
  coachSchedules: state.coachSchedules,
  error: state.error
})
export default connect(mapStateToProps, { beforeSchedluar, getCoachSchedular, createCoachSchedular })(CoachSchedular)