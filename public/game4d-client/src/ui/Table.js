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
                cell_width = this.width / cell_count;
                let row_cells = Object.keys(rows[0]);
                let header = {};
                row_cells.forEach(function(cell_name,cell_index) {
                    header[cell_name] = cell_name;
                });
                rows.unshift(header);
                rows_count++;
                rows.forEach(function(row,row_index){
                    let row_cells = Object.keys(row);
                    row_cells.forEach(function(cell_name,cell_index){
                        let cell = row[cell_name];
                        me.context.textAlign = 'left';
                        me.context.font = (row_index===0?20:15)+"px Consolas";
                        me.context.fillText(cell, me.x + cell_index * cell_width - cell_width, me.y + row_index * row_height - row_height);
                    });
                });
            }
        }
    }
}

export default Table;