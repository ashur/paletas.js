class Palette
{
	/**
	 * @param {Array.Color} colors An array of Color objects
	 */
	constructor( colors )
	{
		this.colors = colors.map( (color, index) =>
		{
			color.index = index;
			color.emit = this.callWizard.bind( this );

			return color;
		});
	}

	/**
	 * Passes colors and index of changed color to wizard, if defined. Called by Color.emit when a value changes.
	 *
	 * @param {number} changedColor Index of color object that emitted change event
	 */
	callWizard( changedColor )
	{
		if( this.wizard )
		{
			this.colors[changedColor].isEditable = false;
			this.colors.forEach( color =>
			{
				color.shouldEmit = false;
			});

			this.wizard( this.colors, changedColor );

			this.colors[changedColor].isEditable = true;
			this.colors.forEach( color =>
			{
				color.shouldEmit = true;
			});
		}
	}
}

module.exports = Palette;