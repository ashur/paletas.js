const chroma = require( 'chroma-js' );

class Color
{
	/**
	 * @param {number} h Hue, 0-359
	 *
	 * @param {number} s Saturation, 0-1
	 *
	 * @param {number} l Lightness, 0-1
	 */
	constructor( h, s, l )
	{
		this.data = {};
		this.emit = function( index ){};
		this.index = null;
		this.isEditable = true;

		this.h = h;
		this.s = s;
		this.l = l;

		this.shouldEmit = true;
	}

	/**
	 * Hue getter and setter
	 */
	get h()
	{
		return this.data.h;
	}
	set h( h )
	{
		if( h >= 0 && h <= 359 )
		{
			this.setValue( 'h', h );
		}
		else
		{
			throw new Error( `Hue value (${h}) out of range (0-359)` );
		}
	}

	/**
	 * Returns hexadecimal representation of color
	 *
	 * @return {string}
	 */
	get hex()
	{
		return chroma.hsl( this.data.h, this.data.s, this.data.l ).hex();
	}

	/**
	 * Saturation getter and setter
	 */
	get s()
	{
		return this.data.s;
	}
	set s( s )
	{
		if( s >= 0 && s <= 1 )
		{
			this.setValue( 's', s );
		}
		else
		{
			throw new Error( `Saturation value (${s}) out of range (0-1)` );
		}
	}

	/**
	 * Lightness getter and setter
	 */
	get l()
	{
		return this.data.l;
	}
	set l( l )
	{
		if( l >= 0 && l <= 1 )
		{
			this.setValue( 'l', l );
		}
		else
		{
			throw new Error( `Lightness value (${l}) out of range (0-1)` );
		}
	}

	/**
	 * Convenience method for setting value and emitting when appropriate
	 *
	 * @param {string} key
	 *
	 * @param {mixed} value
	 */
	setValue( key, value )
	{
		if( this.isEditable )
		{
			this.data[key] = value;

			if( this.shouldEmit )
			{
				this.emit( this.index );
			}
		}
	}
}

module.exports = Color;
