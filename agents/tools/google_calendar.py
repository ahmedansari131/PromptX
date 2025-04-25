from services.EmailService import CalendarService


def get_events():
    calendar_service = CalendarService()
    events = calendar_service.get_events()
    return events


def create_events(**event_details):
    print("In create event tool")
    print("Creating event with details:", event_details)
    calendar_service = CalendarService()
    event = calendar_service.create_event(event_details)
    return event