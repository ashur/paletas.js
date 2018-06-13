const assert = require( "chai" ).assert;
const Color = require( "../src/color.js" );

describe( 'Color', function()
{
	describe( '.isEditable', function()
	{
		it( 'is true by default', function()
		{
			let color = new Color( 1, 0.2, 0.3 );
			assert.isTrue( color.isEditable );
		});

		it( 'prevents property updates when false', function()
	 	{
			let color = new Color( 1, 0.2, 0.3 );
			color.isEditable = false;

			color.h = 2;
			color.s = 0.3;
			color.l = 0.4;

			assert.equal( 1, color.h );
			assert.equal( 0.2, color.s );
			assert.equal( 0.3, color.l );
		});
	});

	describe( '.shouldEmit', function()
	{
		it( 'permits emit call by default', function()
		{
			let color = new Color( 1, 0.2, 0.3 );
			assert.isTrue( color.shouldEmit );

			let emitCanary = 0;
			color.emit = function( index )
			{
				emitCanary++;
			};

			color.h = 2;
			color.s = 0.3;
			color.l = 0.4;

			assert.equal( 3, emitCanary );
		});

		it( 'prevents emit call when false', function()
	 	{
			let color = new Color( 1, 0.2, 0.3 );
			color.shouldEmit = false;

			let emitCanary = 0;
			color.emit = function( index )
			{
				emitCanary++;
			};

			color.h = 2;
			color.s = 0.3;
			color.l = 0.4;

			assert.equal( 0, emitCanary );
		});
	});

	describe( '.h', function()
	{
		it( 'is set by constructor', function()
		{
			let color = new Color( 1, 0.1, 0.2 );
			assert.equal( 1, color.h );
		});

		it( 'throws Error when new value out of range', function()
		{
			let color = new Color( 1, 0.1, 0.2 );

			let didThrow = false;
			try
			{
				color.h = -1;
			}
			catch( error )
			{
				didThrow = true;
			}

			assert.isTrue( didThrow );
		});
	});

	describe( '.hex', function()
	{
		it( 'is computed from HSL values', function()
		{
			let color = new Color( 38.82, 1, 0.5 );
			assert.equal( '#ffa500', color.hex );
		});
	});

	describe( '.s', function()
	{
		it( 'is set by constructor', function()
		{
			let color = new Color( 1, 0.1, 0.2 );
			assert.equal( 0.1, color.s );
		});

		it( 'throws Error when new value out of range', function()
		{
			let color = new Color( 1, 0.1, 0.2 );

			let didThrow = false;
			try
			{
				color.s = 10;
			}
			catch( error )
			{
				didThrow = true;
			}

			assert.isTrue( didThrow );
		});
	});

	describe( '.l', function()
	{
		it( 'is set by constructor', function()
		{
			let color = new Color( 1, 0.1, 0.2 );
			assert.equal( 0.2, color.l );
		});

		it( 'throws Error when new value out of range', function()
		{
			let color = new Color( 1, 0.1, 0.2 );

			let didThrow = false;
			try
			{
				color.l = 10;
			}
			catch( error )
			{
				didThrow = true;
			}

			assert.isTrue( didThrow );
		});
	});

	describe( '.emit', function()
	{
		it( 'receives index as parameter', function()
		{
			let color = new Color( 1, 0.1, 0.2 );
			color.index = 1234;

			let paramValue;
			color.emit = function( index )
			{
				paramValue = index;
			}

			color.h = 120;
			assert.equal( color.index, paramValue );
		});

		it( 'is called when property values are updated', function()
		{
			let color = new Color( 1, 0.2, 0.3 );
			assert.isTrue( color.shouldEmit );

			let emitCanary = 0;
			color.emit = function( index )
			{
				emitCanary++;
			};

			color.h = 2;
			assert.equal( 1, emitCanary );

			color.s = 0.3;
			assert.equal( 2, emitCanary );

			color.l = 0.4;
			assert.equal( 3, emitCanary );
		});
	});
});
