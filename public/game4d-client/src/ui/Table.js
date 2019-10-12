import UiElement from "./UiElement.js";

class Table extends UiElement {
    constructor(props){
        if (!props) {
            props = {};
        }
        super(props);
        this.data = props.data || [];
        this.context = props.context;
    }
    setData(data){
        this.data = data;
    }
    draw(){
        let me = this;
        let rows = this.data;
        let rows_count = this.data.length;
        let cell_count = 0;
        let cells = [];
        let row_height = 30;
        let cell_width = 0;
        if (rows_count) {
            cells = Object.keys(rows[0]);
            cell_count = cells.length;
            if (cell_count) {
                cell_width = me.width / cell_count;
                let row_cells = Object.keys(rows[0]);
                let header = {};
                row_cells.forEach(function(cell_name,cell_index) {
                    header[cell_name] = cell_name;
                });
                rows.unshift(header);
                rows_count++;

                me.height = rows_count * row_height;
                me.context.fillStyle = 'rgba(0,0,0,0.4)';
                me.context.fillRect(me.x, me.y, me.width+10, row_height);
                me.context.fillStyle = 'rgba(0,0,0,0.5)';
                me.context.fillRect(me.x, me.y, me.width+10, me.height-5);

                rows.forEach(function(row,row_index){
                    let row_cells = Object.keys(row);
                    row_cells.forEach(function(cell_name,cell_index){
                        let cell = row[cell_name];
                        me.context.textAlign = 'left';
                        me.context.textBaseline = 'top';
                        me.context.fillStyle = 'white';
                        me.context.font = (row_index===0?20:15)+"px Consolas";
                        me.context.fillText(cell, me.x + cell_index * cell_width+5, me.y + row_index * row_height+5);
                    });
                });
            }
        }
    }
}

export default Table;
