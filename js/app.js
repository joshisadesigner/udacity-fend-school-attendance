/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {

    const model = {
        attendance: JSON.parse(localStorage.attendance),
    }

    const controller = {
    
        /**
         * @desc    Calls List array
         * @param   none
         * @returns Array - List Item
         */
        getAttendance: function() {
          return model.attendance;
        },

        /**
         * @description Assigns new value to array element
         * @param array, index, boolean
         * @returns array index with new boolean
         */
        updateLocalStorage: function( name, index, value ) {
            this.getAttendance()[name][index] = value;
        },

        /**
         * @description Count a student's missed days
         * @param Array to count inner elements
         * @returns integer
         */
        countMissedDays: function( array ) {
            let student = this.getAttendance()[array];
            let daysMissed = 0;

            for (let i = 0; i < student.length; i++ ) {
                if (!student[i]){ daysMissed++ };
            }
            return daysMissed;
        },

        init: function(){
            view.init();
        }
    }

    const view = {
        $allCheckboxes: $(".student__checkbox"),
        $allStudents: $(".student__name"),
        $allStudentsMissedCell: $(".missed-col"),
        attendance: controller.getAttendance(),

        /**
         * @description When a checkbox is clicked, update localStorage
         *              and missed days count
         * @param none
         * @return function
         */
        checkBoxAction: function() {
            this.$allCheckboxes.on('click', function(){
                let $parent = $(this).closest(".student");
                let $studentName = $parent.find(".student__name").text();
                let index = $parent.find(".student__checkbox").index(this);
                let val = this.checked;

                controller.updateLocalStorage( $studentName, index, val );
                view.writeMissedDaysCount();
            });
        },

        /**
         * @description Inserts text in DOM element
         * @param index of element, string
         * @requires DOM elmeent
         */
        insertCellText: function( elem, index, str ) {
            elem[index].innerText = str;
        },

        /**
         * @description Iterates through checkboxes and add value
         * @param none
         * @return DOM element
         */

        checkBoxes: function() {
            let $student = $(".student");
            for ( let i = 0; i < this.$allStudents.length; i ++ ) {
                let name = $($student[i]).find(".student__name").text();
                let $studentCheckboxes = $($student[i]).find(".student__checkbox");

                for ( let a = 0; a < this.attendance[name].length; a++ ) {
                    $studentCheckboxes[a].checked = this.attendance[name][a];
                }
            }
        },

        /**
         * @description Write name column
         * @param none
         * @returns function
         */
        writeNames: function() {
            let i = 0;
            for ( let name in this.attendance ){
                this.insertCellText( this.$allStudents, i, name );
                i++
            }
        },

        /**
         * @description Write missing days column
         * @param none
         * @returns function
         */
        writeMissedDaysCount: function() {
            let i = 0;
            for ( let name in this.attendance ){
                this.insertCellText( this.$allStudentsMissedCell, i, controller.countMissedDays( name ) );
                i++
            }
        },

        init: function() {
            this.writeMissedDaysCount();
            this.writeNames();
            this.checkBoxes();
            this.checkBoxAction();
        }
    }

    controller.init();
}());
