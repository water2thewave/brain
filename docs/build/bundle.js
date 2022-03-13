
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function (d3) {
    'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var d3__namespace = /*#__PURE__*/_interopNamespace(d3);

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\KnowledgeGraph.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1, console: console_1$1 } = globals;
    const file$1 = "src\\KnowledgeGraph.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[25] = list[i];
    	return child_ctx;
    }

    // (214:8) {#each links as l}
    function create_each_block_1(ctx) {
    	let line;
    	let line_x__value;
    	let line_y__value;
    	let line_x__value_1;
    	let line_y__value_1;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "x1", line_x__value = /*l*/ ctx[25].source.x);
    			attr_dev(line, "y1", line_y__value = /*l*/ ctx[25].source.y);
    			attr_dev(line, "x2", line_x__value_1 = /*l*/ ctx[25].target.x);
    			attr_dev(line, "y2", line_y__value_1 = /*l*/ ctx[25].target.y);
    			attr_dev(line, "class", "link svelte-1a4uq05");
    			add_location(line, file$1, 214, 12, 6194);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links*/ 8 && line_x__value !== (line_x__value = /*l*/ ctx[25].source.x)) {
    				attr_dev(line, "x1", line_x__value);
    			}

    			if (dirty & /*links*/ 8 && line_y__value !== (line_y__value = /*l*/ ctx[25].source.y)) {
    				attr_dev(line, "y1", line_y__value);
    			}

    			if (dirty & /*links*/ 8 && line_x__value_1 !== (line_x__value_1 = /*l*/ ctx[25].target.x)) {
    				attr_dev(line, "x2", line_x__value_1);
    			}

    			if (dirty & /*links*/ 8 && line_y__value_1 !== (line_y__value_1 = /*l*/ ctx[25].target.y)) {
    				attr_dev(line, "y2", line_y__value_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(214:8) {#each links as l}",
    		ctx
    	});

    	return block;
    }

    // (220:8) {#each nodes as n}
    function create_each_block(ctx) {
    	let g;
    	let circle;
    	let circle_r_value;
    	let text_1;
    	let t0_value = /*n*/ ctx[22].word + "";
    	let t0;
    	let title;
    	let t1_value = /*n*/ ctx[22].word + "";
    	let t1;
    	let g_transform_value;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[9](/*n*/ ctx[22], ...args);
    	}

    	function mouseover_handler(...args) {
    		return /*mouseover_handler*/ ctx[10](/*n*/ ctx[22], ...args);
    	}

    	function mousedown_handler(...args) {
    		return /*mousedown_handler*/ ctx[12](/*n*/ ctx[22], ...args);
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			circle = svg_element("circle");
    			text_1 = svg_element("text");
    			t0 = text(t0_value);
    			title = svg_element("title");
    			t1 = text(t1_value);
    			attr_dev(circle, "r", circle_r_value = /*n*/ ctx[22].radius || defaultSize);
    			attr_dev(circle, "class", "node svelte-1a4uq05");
    			add_location(circle, file$1, 227, 12, 6761);
    			attr_dev(text_1, "x", "-8");
    			attr_dev(text_1, "y", "6");
    			add_location(text_1, file$1, 228, 12, 6833);
    			add_location(title, file$1, 229, 12, 6881);
    			attr_dev(g, "transform", g_transform_value = "translate(" + (/*n*/ ctx[22].x || 0) + ", " + (/*n*/ ctx[22].y || 50) + ")");
    			attr_dev(g, "class", "node svelte-1a4uq05");
    			add_location(g, file$1, 220, 10, 6377);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, circle);
    			append_dev(g, text_1);
    			append_dev(text_1, t0);
    			append_dev(g, title);
    			append_dev(title, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(g, "click", prevent_default(click_handler), false, true, false),
    					listen_dev(g, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(g, "mouseout", /*mouseout_handler*/ ctx[11], false, false, false),
    					listen_dev(g, "mousedown", mousedown_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*nodes*/ 4 && circle_r_value !== (circle_r_value = /*n*/ ctx[22].radius || defaultSize)) {
    				attr_dev(circle, "r", circle_r_value);
    			}

    			if (dirty & /*nodes*/ 4 && t0_value !== (t0_value = /*n*/ ctx[22].word + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*nodes*/ 4 && t1_value !== (t1_value = /*n*/ ctx[22].word + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*nodes*/ 4 && g_transform_value !== (g_transform_value = "translate(" + (/*n*/ ctx[22].x || 0) + ", " + (/*n*/ ctx[22].y || 50) + ")")) {
    				attr_dev(g, "transform", g_transform_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(220:8) {#each nodes as n}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div1;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let div0;
    	let t3;
    	let t4;
    	let div3;
    	let svg;
    	let g0;
    	let g1;
    	let svg_viewBox_value;
    	let t5;
    	let div2;
    	let each_value_1 = /*links*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*nodes*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			t0 = text("Here be elements ");
    			t1 = text(/*tooltipText*/ ctx[4]);
    			t2 = space();
    			div0 = element("div");
    			t3 = text(/*tooltipText*/ ctx[4]);
    			t4 = space();
    			div3 = element("div");
    			svg = svg_element("svg");
    			g0 = svg_element("g");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			g1 = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div2 = element("div");
    			add_location(h1, file$1, 206, 1, 5810);
    			attr_dev(div0, "visibility", /*tooltipVisibility*/ ctx[5]);
    			attr_dev(div0, "class", "tooltip");
    			add_location(div0, file$1, 207, 2, 5853);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file$1, 205, 0, 5784);
    			attr_dev(g0, "id", "links");
    			add_location(g0, file$1, 212, 6, 6138);
    			attr_dev(g1, "id", "nodes");
    			add_location(g1, file$1, 218, 6, 6323);
    			attr_dev(svg, "id", "knowledge-graph-svg");
    			attr_dev(svg, "class", "svg-content svelte-1a4uq05");
    			attr_dev(svg, "preserveAspectRatio", "xMinYMin meet");
    			attr_dev(svg, "viewBox", svg_viewBox_value = "0 0 " + /*width*/ ctx[0] + " " + /*height*/ ctx[1]);
    			add_location(svg, file$1, 211, 4, 6013);
    			attr_dev(div2, "id", "knowledge-graph");
    			add_location(div2, file$1, 236, 4, 6971);
    			attr_dev(div3, "id", "knowledge-graph-container");
    			attr_dev(div3, "class", "svg-container graph-bg svelte-1a4uq05");
    			add_location(div3, file$1, 210, 2, 5940);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, svg);
    			append_dev(svg, g0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(g0, null);
    			}

    			append_dev(svg, g1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g1, null);
    			}

    			append_dev(div3, t5);
    			append_dev(div3, div2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tooltipText*/ 16) set_data_dev(t1, /*tooltipText*/ ctx[4]);
    			if (dirty & /*tooltipText*/ 16) set_data_dev(t3, /*tooltipText*/ ctx[4]);

    			if (dirty & /*tooltipVisibility*/ 32) {
    				attr_dev(div0, "visibility", /*tooltipVisibility*/ ctx[5]);
    			}

    			if (dirty & /*links*/ 8) {
    				each_value_1 = /*links*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(g0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*nodes, handleNodeClick, tooltipVisibility, tooltipText, handleMiddleButton, defaultSize*/ 244) {
    				each_value = /*nodes*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(g1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*width, height*/ 3 && svg_viewBox_value !== (svg_viewBox_value = "0 0 " + /*width*/ ctx[0] + " " + /*height*/ ctx[1])) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div3);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const jsonUrl = 'data.json';
    const defaultSize = 30;

    function handleClickOutside(event, d) {
    	
    } // when we click outside, we want to create a node

    function saveToBrowser(nodes, links) {
    	// Save to localstorage on each change
    	const saveLinks = links.map(link => {
    		let { index, source, target } = link;
    		return { source: source.id, target: target.id };
    	});

    	// const saveNodes = nodes.map(({id, word}) =>  {id, word});
    	// const saveData = {nodes: saveNodes, links: saveLinks};
    	const saveData = { nodes, links: saveLinks };

    	console.log('saved to localStorage', saveData);
    	let jsonStr = JSON.stringify(saveData);
    	localStorage.setItem('wizard', jsonStr);
    }

    function loadLocalStorage() {
    	return new Promise((resolve, reject) => {
    			const key = 'wizard';
    			let loadedJson = localStorage.getItem(key);

    			if (!loadedJson) {
    				throw Error(`Blank json in localstorage for key "${key}"`);
    			}

    			try {
    				resolve(JSON.parse(loadedJson));
    			} catch(e) {
    				console.error({
    					loadedJson, //  console.log({loadedJson});
    					
    				});

    				throw Error(`Invalid json in localstorage for key "${key}"`);
    			}
    		});
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('KnowledgeGraph', slots, []);
    	let { width, height, data } = $$props;
    	data = data || { links: [], nodes: [] }; // raw data
    	var nodes = [];
    	var links = [];
    	var tooltipText = "blank tooltip";
    	var tooltipVisibility = "hidden";
    	let link = d3__namespace.select("#links").selectAll("g");
    	let node = d3__namespace.select("#nodes").selectAll("g");

    	// $: d = d3.select('#nodes').selectAll('g').on("click", (e,d) => (handleNodeClick(e,d)));
    	let simulation = d3__namespace.forceSimulation();

    	loadLocalStorage().then(obj => {
    		console.log(`Loaded json from localstorage`, obj);
    		$$invalidate(2, nodes = obj.nodes);
    		$$invalidate(3, links = obj.links);
    	}).catch(e => {
    		// load default data
    		console.info(e.message);

    		console.log('Loading default data');

    		d3__namespace.json(jsonUrl).then(obj => {
    			$$invalidate(2, nodes = obj.nodes);
    			$$invalidate(3, links = obj.links);
    			updateSimulation();
    		}).catch(console.error);
    	}).finally(() => updateSimulation());

    	function updateSimulation() {
    		setupSimulation();
    		simulation.alpha(0.3).alphaTarget(0).restart();
    	}

    	function setupSimulation() {
    		simulation.nodes(nodes).force("center", d3__namespace.forceCenter().x(width / 2).y(height / 2)).force("charge", d3__namespace.forceManyBody().strength(d => -1 * d.radius * 20 || -1 * defaultSize * 20)).force("collide", d3__namespace.forceCollide().strength(1).radius(d => d.radius).iterations(8)).force("x", d3__namespace.forceX().strength(width < 700 ? .2 * height / width : 0.05)).force("y", d3__namespace.forceY().strength(width < 700 ? .16 * width / height : 0.05)).force("link", d3__namespace.forceLink().id(d => d.id).links(links)).on("tick", () => ticked()); // Acts on the node of the graph (attraction of nodes)
    		// Acts on the node of the graph (avoid collapsing)
    		// Acts as gravity on nodes (display in canvas)
    		// Acts on the link of the graph
    	}

    	function ticked(node, link) {
    		// assigning nodes back to nodes triggers svelte to re-read for bindings
    		$$invalidate(2, nodes);

    		$$invalidate(3, links);
    	}

    	function handleNodeClick(event, d) {
    		const leftClicked = event.button == 0 || 1 == event.button & 1;
    		const rightClicked = event.button == 2 || 1 == event.button & 3;

    		if (leftClicked) {
    			// TODO show max depth of 2
    			traverse({ root: d }, (n, level) => {
    				// set brightness to max depth
    				const maxLevel = 3;

    				let newRadius = level > maxLevel
    				? 0
    				: (1 - level / maxLevel) * defaultSize;

    				n.radius = newRadius;
    			});

    			node.selectAll('circle').attr("r", d => d.radius);
    			updateSimulation();
    		} else if (rightClicked) {
    			console.log(`Right button clicked "${d.word}"`);
    		} else {
    			console.log(`Some button clicked "${d.word}"`);
    		}
    	}

    	function createNewNode(clickedNode) {
    		const newId = nodes.length;
    		let node = { "id": newId, "word": `newNode #${newId}` };

    		let link = {
    			"source": clickedNode.id,
    			"target": newId
    		};

    		nodes.push({ ...node });
    		links.push({ ...link });
    		updateSimulation();
    		saveToBrowser(nodes, links);
    	}

    	function handleMiddleButton(event, clickedNode) {
    		const middleClicked = event.button == 1 || 1 == event.button & 2;
    		if (!middleClicked) return;
    		console.log(`Middle button clicked `);
    		event.preventDefault();
    		createNewNode(clickedNode);
    	}

    	function traverse(options, callback) {
    		// Traverse the graph ignoring starting from root, ignoring link direction.
    		const { root } = options;

    		const level = options.level || 0;
    		const visited = options.visited || {};
    		if (visited[root.id] == true) return;
    		callback(root, level);
    		visited[root.id] = true;

    		// DFS
    		let q = getNeighborsOf(root);

    		for (let i in q) {
    			let n = q[i];
    			traverse({ root: n, level: level + 1, visited }, callback);
    		}
    	}

    	function getNeighborsOf(n) {
    		return links.reduce(
    			(neighbors, link) => {
    				let isNeighbor = link.source.id == n.id || link.target.id == n.id;

    				if (isNeighbor) {
    					let neighbor = link.source.id != n.id ? link.source : link.target;

    					// console.log({ neighbor: neighbor.word });
    					neighbors.push(neighbor);
    				}

    				return neighbors;
    			},
    			[]
    		);
    	}

    	const writable_props = ['width', 'height', 'data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<KnowledgeGraph> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (n, e) => handleNodeClick(e, n);

    	const mouseover_handler = (n, e) => {
    		$$invalidate(5, tooltipVisibility = "visible");
    		$$invalidate(4, tooltipText = n.word);
    	};

    	const mouseout_handler = e => {
    		$$invalidate(5, tooltipVisibility = "hidden");
    		$$invalidate(4, tooltipText = "");
    	};

    	const mousedown_handler = (n, e) => handleMiddleButton(e, n);

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('data' in $$props) $$invalidate(8, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({
    		width,
    		height,
    		data,
    		d3: d3__namespace,
    		prevent_default,
    		jsonUrl,
    		defaultSize,
    		nodes,
    		links,
    		tooltipText,
    		tooltipVisibility,
    		link,
    		node,
    		simulation,
    		updateSimulation,
    		setupSimulation,
    		ticked,
    		handleNodeClick,
    		handleClickOutside,
    		createNewNode,
    		handleMiddleButton,
    		traverse,
    		getNeighborsOf,
    		saveToBrowser,
    		loadLocalStorage
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('data' in $$props) $$invalidate(8, data = $$props.data);
    		if ('nodes' in $$props) $$invalidate(2, nodes = $$props.nodes);
    		if ('links' in $$props) $$invalidate(3, links = $$props.links);
    		if ('tooltipText' in $$props) $$invalidate(4, tooltipText = $$props.tooltipText);
    		if ('tooltipVisibility' in $$props) $$invalidate(5, tooltipVisibility = $$props.tooltipVisibility);
    		if ('link' in $$props) link = $$props.link;
    		if ('node' in $$props) node = $$props.node;
    		if ('simulation' in $$props) simulation = $$props.simulation;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		height,
    		nodes,
    		links,
    		tooltipText,
    		tooltipVisibility,
    		handleNodeClick,
    		handleMiddleButton,
    		data,
    		click_handler,
    		mouseover_handler,
    		mouseout_handler,
    		mousedown_handler
    	];
    }

    class KnowledgeGraph extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { width: 0, height: 1, data: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KnowledgeGraph",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console_1$1.warn("<KnowledgeGraph> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !('height' in props)) {
    			console_1$1.warn("<KnowledgeGraph> was created without expected prop 'height'");
    		}

    		if (/*data*/ ctx[8] === undefined && !('data' in props)) {
    			console_1$1.warn("<KnowledgeGraph> was created without expected prop 'data'");
    		}
    	}

    	get width() {
    		throw new Error_1("<KnowledgeGraph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error_1("<KnowledgeGraph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error_1("<KnowledgeGraph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error_1("<KnowledgeGraph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error_1("<KnowledgeGraph>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error_1("<KnowledgeGraph>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let div2;
    	let a0;
    	let t1;
    	let button;
    	let t3;
    	let div1;
    	let div0;
    	let label;
    	let t5;
    	let textarea;
    	let t6;
    	let a1;
    	let t8;
    	let knowledgegraph;
    	let current;
    	let mounted;
    	let dispose;

    	knowledgegraph = new KnowledgeGraph({
    			props: {
    				width: window.innerWidth,
    				height: window.innerHeight
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			a0 = element("a");
    			a0.textContent = "Delete localstorage";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Show localstorage";
    			t3 = space();
    			div1 = element("div");
    			div0 = element("div");
    			label = element("label");
    			label.textContent = "'wizard'";
    			t5 = space();
    			textarea = element("textarea");
    			t6 = space();
    			a1 = element("a");
    			a1.textContent = "Copy text";
    			t8 = space();
    			create_component(knowledgegraph.$$.fragment);
    			attr_dev(a0, "class", "btn btn-primary delete-localstorage");
    			attr_dev(a0, "role", "button");
    			add_location(a0, file, 14, 1, 241);
    			attr_dev(button, "class", "btn btn-primary show-localstorage");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "data-toggle", "collapse");
    			attr_dev(button, "role", "button");
    			attr_dev(button, "aria-expanded", "true");
    			attr_dev(button, "aria-controls", "lscontent");
    			attr_dev(button, "data-target", "#lscontent");
    			add_location(button, file, 19, 1, 364);
    			attr_dev(label, "for", "edit-json");
    			add_location(label, file, 25, 3, 642);
    			attr_dev(textarea, "class", "edit-json");
    			textarea.value = " dummy ";
    			add_location(textarea, file, 26, 3, 687);
    			attr_dev(a1, "class", "copy-json btn btn-primary");
    			add_location(a1, file, 27, 3, 737);
    			attr_dev(div0, "class", "card cardbody");
    			add_location(div0, file, 24, 2, 611);
    			attr_dev(div1, "class", "collapse");
    			attr_dev(div1, "id", "lscontent");
    			add_location(div1, file, 23, 1, 571);
    			attr_dev(div2, "class", "localstorage container");
    			add_location(div2, file, 13, 0, 203);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, a0);
    			append_dev(div2, t1);
    			append_dev(div2, button);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, label);
    			append_dev(div0, t5);
    			append_dev(div0, textarea);
    			append_dev(div0, t6);
    			append_dev(div0, a1);
    			insert_dev(target, t8, anchor);
    			mount_component(knowledgegraph, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a0, "click", deleteLocalStorage, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(knowledgegraph.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(knowledgegraph.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t8);
    			destroy_component(knowledgegraph, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function deleteLocalStorage() {
    	window.localStorage.clear();
    	console.log('Localstorage deleted');
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({ name, KnowledgeGraph, deleteLocalStorage });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console_1.warn("<App> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})(d3);
//# sourceMappingURL=bundle.js.map
