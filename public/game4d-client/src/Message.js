class Message {
    constructor(props) {
        this.id = props.id
        this.text = props.text
        this.created = new Date()
    }

    update() {
        if (new Date().getTime() - this.created.getTime() > 5000) {
            //msgs.delete(this.id)
        }
    }
}

export default Message;
