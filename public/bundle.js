
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop$2() { }
    const identity$4 = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe$4(store, ...callbacks) {
        if (store == null) {
            return noop$2;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe$4(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop$2;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update$4(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
    }
    function update$4($$) {
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
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
    function init$4(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop$2,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
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
            this.$destroy = noop$2;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.37.0' }, detail)));
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

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop$2) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop$2) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop$2;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const logs = writable(["Try 'help' command"]);

    const Print = (message) => {
        logs.update((l) => {
            if (l.length > 100) {
                return [...l, message].slice(l.length - 100)
            }
            return [...l, message]
        });
    };

    const BreakLine = () => {
        logs.update((l) => [...l, 1]);
    };

    const ClearLog = () => {
        logs.set([]);
    };

    const Prompt = (command) => {
        Print(`USER>${command}`);
    };

    /* src/Terminal.svelte generated by Svelte v3.37.0 */
    const file$8 = "src/Terminal.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    // (175:16) {:else}
    function create_else_block(ctx) {
    	let li;
    	let t_value = /*log*/ ctx[11] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-i3ue97");
    			add_location(li, file$8, 175, 20, 5285);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$logs*/ 4 && t_value !== (t_value = /*log*/ ctx[11] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(175:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (173:16) {#if log == 1}
    function create_if_block$5(ctx) {
    	let br;

    	const block = {
    		c: function create() {
    			br = element("br");
    			add_location(br, file$8, 173, 20, 5234);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    		},
    		p: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(173:16) {#if log == 1}",
    		ctx
    	});

    	return block;
    }

    // (172:12) {#each $logs as log}
    function create_each_block$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*log*/ ctx[11] == 1) return create_if_block$5;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(172:12) {#each $logs as log}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div1;
    	let div0;
    	let ul;
    	let t;
    	let input;
    	let mounted;
    	let dispose;
    	let each_value = /*$logs*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			input = element("input");
    			attr_dev(ul, "class", "svelte-i3ue97");
    			add_location(ul, file$8, 170, 8, 5123);
    			attr_dev(div0, "class", "logs svelte-i3ue97");
    			add_location(div0, file$8, 169, 4, 5096);
    			attr_dev(input, "class", "svelte-i3ue97");
    			add_location(input, file$8, 181, 4, 5372);
    			attr_dev(div1, "class", "terminal svelte-i3ue97");
    			add_location(div1, file$8, 168, 0, 5069);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			/*ul_binding*/ ctx[4](ul);
    			append_dev(div1, t);
    			append_dev(div1, input);
    			set_input_value(input, /*command*/ ctx[0]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[5]),
    					listen_dev(input, "keypress", /*onKeyPress*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$logs*/ 4) {
    				each_value = /*$logs*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*command*/ 1 && input.value !== /*command*/ ctx[0]) {
    				set_input_value(input, /*command*/ ctx[0]);
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			/*ul_binding*/ ctx[4](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $logs;
    	validate_store(logs, "logs");
    	component_subscribe($$self, logs, $$value => $$invalidate(2, $logs = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Terminal", slots, []);
    	const dispatch = createEventDispatcher();
    	let history = [];
    	let command = "help";
    	let logs_list;
    	let autoscroll;

    	beforeUpdate(() => {
    		autoscroll = logs_list && logs_list.offsetHeight + logs_list.scrollTop > logs_list.scrollHeight - 20;
    	});

    	afterUpdate(() => {
    		if (autoscroll) logs_list.scrollTo(0, logs_list.scrollHeight);
    	});

    	const COMMAND_LIB = {
    		help: () => {
    			Print("==============K-MEANS CLUSTERING==============");
    			BreakLine();
    			Print("help");
    			Print("Show this help");
    			BreakLine();
    			Print("assign");
    			Print("Assign each observation to the cluster with the nearest mean.");
    			BreakLine();
    			Print("update");
    			Print("Recalculate means (centroids) for observations assigned to each cluster.");
    			BreakLine();
    			Print("fit");
    			Print("Repeat assign and update until the assignments no longer change.");
    			BreakLine();
    			Print("set --help");
    			Print("To show how to set variables");
    			BreakLine();
    			Print("reset");
    			Print("Shuffle data again, it will recreate centers of data and random change position of labels");
    			BreakLine();
    			Print("git be email web");
    			Print("Show about me");
    			BreakLine();
    			Print("clear history");
    			Print("Same with terminal");
    		},
    		assign: () => {
    			dispatch("assign");
    		},
    		update: () => {
    			dispatch("update");
    		},
    		fit: () => {
    			dispatch("fit");
    		},
    		reset: () => {
    			dispatch("reset");
    		},
    		history: () => {
    			history.forEach(c => {
    				Print(c);
    			});
    		},
    		clear: () => {
    			ClearLog();
    		},
    		git: () => {
    			window.open("https://github.com/vanviethieuanh/k-means-clustering", "_blank");
    		},
    		github: () => {
    			window.open("https://github.com/vanviethieuanh/k-means-clustering", "_blank");
    		},
    		be: () => {
    			window.open("https://www.behance.net/vanviethieuanh", "_blank");
    		},
    		behance: () => {
    			window.open("https://www.behance.net/vanviethieuanh", "_blank");
    		},
    		web: () => {
    			window.open("https://vanviethieuanh.com/", "_blank");
    		},
    		email: () => {
    			navigator.clipboard.writeText("vanviethieuanh@gmail.com");
    			Print("✉ Email copied to clipboard!");
    		},
    		mail: () => {
    			navigator.clipboard.writeText("vanviethieuanh@gmail.com");
    			Print("✉ Email copied to clipboard!");
    		}
    	};

    	function Excute() {
    		history.push(command);
    		Prompt(command);

    		if (command.slice(0, 3) == "set") {
    			const commands = command.split(" ");
    			$$invalidate(0, command = "");

    			if (commands[1] == "--help") {
    				Print(`set label <n>`);
    				Print(`Set the amount of label (2≤n≤9)`);
    				BreakLine();
    				Print(`set data <n>`);
    				Print(`Set the amount data for each label (n ≥ 10 , should be < 100 for better visualize)`);
    				BreakLine();
    				Print(`set error <n>`);
    				Print(`Set the error range for data from center point (5≤n≤50)`);
    				return;
    			}

    			if (commands[1] == "label" && commands[2] && !isNaN(commands[2])) {
    				if (commands[2] <= 9 && commands[2] >= 2) {
    					dispatch("setLabel", { num: parseInt(commands[2]) });
    					return;
    				}
    			}

    			if (commands[1] == "data" && commands[2] && !isNaN(commands[2])) {
    				if (commands[2] >= 10) {
    					dispatch("setData", { num: parseInt(commands[2]) });
    					return;
    				}
    			}

    			if (commands[1] == "error" && commands[2] && !isNaN(commands[2])) {
    				if (commands[2] <= 50 && commands[2] >= 5) {
    					dispatch("setError", { num: parseInt(commands[2]) });
    					return;
    				}
    			}

    			Print(`Type "set --help" for more information`);
    			return;
    		}

    		if (COMMAND_LIB[command]) {
    			COMMAND_LIB[command]();
    		} else {
    			Print(`Command not found: ${command}`);
    		}

    		$$invalidate(0, command = "");
    	}

    	const onKeyPress = e => {
    		if (e.charCode === 13) Excute();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Terminal> was created with unknown prop '${key}'`);
    	});

    	function ul_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			logs_list = $$value;
    			$$invalidate(1, logs_list);
    		});
    	}

    	function input_input_handler() {
    		command = this.value;
    		$$invalidate(0, command);
    	}

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		beforeUpdate,
    		afterUpdate,
    		logs,
    		Print,
    		ClearLog,
    		BreakLine,
    		Prompt,
    		dispatch,
    		history,
    		command,
    		logs_list,
    		autoscroll,
    		COMMAND_LIB,
    		Excute,
    		onKeyPress,
    		$logs
    	});

    	$$self.$inject_state = $$props => {
    		if ("history" in $$props) history = $$props.history;
    		if ("command" in $$props) $$invalidate(0, command = $$props.command);
    		if ("logs_list" in $$props) $$invalidate(1, logs_list = $$props.logs_list);
    		if ("autoscroll" in $$props) autoscroll = $$props.autoscroll;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [command, logs_list, $logs, onKeyPress, ul_binding, input_input_handler];
    }

    class Terminal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$4(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Terminal",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    // Taken from https://github.com/rafgraph/detect-it/blob/main/src/index.ts

    const w = typeof window !== 'undefined' ? window : { screen: {}, navigator: {} };
    const matchMedia = w.matchMedia || (() => ({ matches: false }));

    let passiveOptionAccessed = false;
    const options = {
      get passive () {
        return (passiveOptionAccessed = true)
      }
    };

    const noop$1 = () => {};
    w.addEventListener && w.addEventListener('p', noop$1, options);
    w.removeEventListener && w.removeEventListener('p', noop$1, false);

    const supportsPassiveEvents = passiveOptionAccessed;

    const supportsPointerEvents = 'PointerEvent' in w;

    const onTouchStartInWindow = 'ontouchstart' in w;
    const touchEventInWindow = 'TouchEvent' in w;

    const supportsTouchEvents =
      onTouchStartInWindow || (touchEventInWindow && matchMedia('(any-pointer: coarse)').matches);

    const hasTouch = (w.navigator.maxTouchPoints || 0) > 0 || supportsTouchEvents;

    const userAgent = w.navigator.userAgent || '';

    const isIPad =
      matchMedia('(pointer: coarse)').matches &&
      /iPad|Macintosh/.test(userAgent) &&
      Math.min(w.screen.width || 0, w.screen.height || 0) >= 768;

    const hasCoarsePrimaryPointer =
      (matchMedia('(pointer: coarse)').matches ||
      (!matchMedia('(pointer: fine)').matches && onTouchStartInWindow)) &&
      !/Windows.*Firefox/.test(userAgent);

    const hasAnyHoverOrAnyFinePointer =
      matchMedia('(any-pointer: fine)').matches ||
      matchMedia('(any-hover: hover)').matches ||
      isIPad || !onTouchStartInWindow;

    const deviceType =
      hasTouch && (hasAnyHoverOrAnyFinePointer || !hasCoarsePrimaryPointer)
        ? 'hybrid'
        : hasTouch
          ? 'touchOnly'
          : 'mouseOnly';

    const primaryInput =
      deviceType === 'mouseOnly'
        ? 'mouse'
        : deviceType === 'touchOnly'
          ? 'touch'
          : hasCoarsePrimaryPointer
            ? 'touch'
            : 'mouse';

    var detectIt = /*#__PURE__*/Object.freeze({
        __proto__: null,
        supportsPassiveEvents: supportsPassiveEvents,
        supportsPointerEvents: supportsPointerEvents,
        supportsTouchEvents: supportsTouchEvents,
        deviceType: deviceType,
        primaryInput: primaryInput
    });

    class GraphicContext {
      constructor ({ renderer }) {
        if (!renderer) {
          this._rendererOptions = { output: 'svg' };
        }

        if (renderer) {
          validateRendererOptions(renderer);
          this._rendererOptions = renderer;
        }
      }

      output () {
        return this._rendererOptions.output
      }
    }

    function validateRendererOptions (options) {
      if (!(
        options.constructor === Object &&
        'output' in options &&
        ['svg'].includes(options.output)
      )) {
        throw new Error(`Invalid renderer options: ${JSON.stringify(options)}`)
      }
    }

    const key$3 = {};

    function subscribe$3 () {
      return getContext(key$3)
    }

    function init$3 () {
      const graphicContext = writable();
      setContext(key$3, graphicContext);

      return graphicContext
    }

    function update$3 (graphicContext, options) {
      graphicContext.set(new GraphicContext(options));
    }

    var GraphicContext$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        subscribe: subscribe$3,
        init: init$3,
        update: update$3
    });

    function parsePadding (_padding) {
      const padding = _padding === undefined
        ? 0
        : _padding;

      if (padding.constructor === Number) {
        return { left: padding, right: padding, top: padding, bottom: padding }
      }

      if (padding.constructor === Object) {
        return Object.assign(
          parsePadding(0),
          padding
        )
      }

      throw invalidPaddingError
    }

    const invalidPaddingError = new Error('Invalid padding specification');

    function applyPadding (range, offsetMin, offsetMax) {
      ensurePaddingSmallerThanRange(range, offsetMin, offsetMax);

      if (range[0] < range[1]) {
        return [range[0] + offsetMin, range[1] - offsetMax]
      } else {
        return [range[0] - offsetMax, range[1] + offsetMin]
      }
    }

    function ensurePaddingSmallerThanRange (range, min, max) {
      if (Math.abs(range[0] - range[1]) < (min + max)) {
        console.warn('Padding cannot exceed width or height');
      }
    }

    function getRanges ({ coordinates }) {
      return {
        rangeX: [coordinates.x1, coordinates.x2],
        rangeY: [coordinates.y1, coordinates.y2]
      }
    }

    function getFinalRanges (sectionContext, ranges, padding) {
      const { flipX, flipY, zoomIdentity } = sectionContext;
      const { rangeX, rangeY } = ranges;
      const { left, right, top, bottom } = padding;

      let finalRangeX = applyFlip(rangeX, flipX);
      finalRangeX = applyPadding(finalRangeX, left, right);

      if (zoomIdentity) {
        validateZoomFactor(zoomIdentity.kx);
        finalRangeX = applyZoom(finalRangeX, zoomIdentity.kx, zoomIdentity.x);
      }

      let finalRangeY = applyFlip(rangeY, flipY);
      finalRangeY = applyPadding(finalRangeY, top, bottom);

      if (zoomIdentity) {
        validateZoomFactor(zoomIdentity.ky);
        finalRangeY = applyZoom(finalRangeY, zoomIdentity.ky, zoomIdentity.y);
      }

      return { finalRangeX, finalRangeY }
    }

    function applyFlip (range, flip) {
      return flip
        ? [range[1], range[0]]
        : range
    }

    function applyZoom (range, k, translate) {
      return [
        range[0] * k + translate,
        range[1] * k + translate
      ]
    }

    function validateZoomFactor (k) {
      if (k < 0) throw new Error('Zoom factors have to be positive')
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(f) {
      let delta = f;
      let compare = f;

      if (f.length === 1) {
        delta = (d, x) => f(d) - x;
        compare = ascendingComparator(f);
      }

      function left(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      }

      function right(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        while (lo < hi) {
          const mid = (lo + hi) >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }

      function center(a, x, lo, hi) {
        if (lo == null) lo = 0;
        if (hi == null) hi = a.length;
        const i = left(a, x, lo, hi - 1);
        return i > lo && delta(a[i - 1], x) > -delta(a[i], x) ? i - 1 : i;
      }

      return {left, center, right};
    }

    function ascendingComparator(f) {
      return (d, x) => ascending(f(d), x);
    }

    function number$2(x) {
      return x === null ? NaN : +x;
    }

    const ascendingBisect = bisector(ascending);
    const bisectRight = ascendingBisect.right;
    bisector(number$2).center;

    // https://github.com/python/cpython/blob/a74eea238f5baba15797e2e8b570d153bc8690a7/Modules/mathmodule.c#L1423
    class Adder {
      constructor() {
        this._partials = new Float64Array(32);
        this._n = 0;
      }
      add(x) {
        const p = this._partials;
        let i = 0;
        for (let j = 0; j < this._n && j < 32; j++) {
          const y = p[j],
            hi = x + y,
            lo = Math.abs(x) < Math.abs(y) ? x - (hi - y) : y - (hi - x);
          if (lo) p[i++] = lo;
          x = hi;
        }
        p[i] = x;
        this._n = i + 1;
        return this;
      }
      valueOf() {
        const p = this._partials;
        let n = this._n, x, y, lo, hi = 0;
        if (n > 0) {
          hi = p[--n];
          while (n > 0) {
            x = hi;
            y = p[--n];
            hi = x + y;
            lo = y - (hi - x);
            if (lo) break;
          }
          if (n > 0 && ((lo < 0 && p[n - 1] < 0) || (lo > 0 && p[n - 1] > 0))) {
            y = lo * 2;
            x = hi + y;
            if (y == x - hi) hi = x;
          }
        }
        return hi;
      }
    }

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        let r0 = Math.round(start / step), r1 = Math.round(stop / step);
        if (r0 * step < start) ++r0;
        if (r1 * step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) * step;
      } else {
        step = -step;
        let r0 = Math.round(start * step), r1 = Math.round(stop * step);
        if (r0 / step < start) ++r0;
        if (r1 / step > stop) --r1;
        ticks = new Array(n = r1 - r0 + 1);
        while (++i < n) ticks[i] = (r0 + i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function initRange(domain, range) {
      switch (arguments.length) {
        case 0: break;
        case 1: this.range(domain); break;
        default: this.range(range).domain(domain); break;
      }
      return this;
    }

    function define$1(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend$1(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color$1() {}

    var darker$1 = 0.7;
    var brighter$1 = 1 / darker$1;

    var reI$1 = "\\s*([+-]?\\d+)\\s*",
        reN$1 = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP$1 = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex$1 = /^#([0-9a-f]{3,8})$/,
        reRgbInteger$1 = new RegExp("^rgb\\(" + [reI$1, reI$1, reI$1] + "\\)$"),
        reRgbPercent$1 = new RegExp("^rgb\\(" + [reP$1, reP$1, reP$1] + "\\)$"),
        reRgbaInteger$1 = new RegExp("^rgba\\(" + [reI$1, reI$1, reI$1, reN$1] + "\\)$"),
        reRgbaPercent$1 = new RegExp("^rgba\\(" + [reP$1, reP$1, reP$1, reN$1] + "\\)$"),
        reHslPercent$1 = new RegExp("^hsl\\(" + [reN$1, reP$1, reP$1] + "\\)$"),
        reHslaPercent$1 = new RegExp("^hsla\\(" + [reN$1, reP$1, reP$1, reN$1] + "\\)$");

    var named$1 = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define$1(Color$1, color$1, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex$1, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex$1,
      formatHsl: color_formatHsl$1,
      formatRgb: color_formatRgb$1,
      toString: color_formatRgb$1
    });

    function color_formatHex$1() {
      return this.rgb().formatHex();
    }

    function color_formatHsl$1() {
      return hslConvert$1(this).formatHsl();
    }

    function color_formatRgb$1() {
      return this.rgb().formatRgb();
    }

    function color$1(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex$1.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn$1(m) // #ff0000
          : l === 3 ? new Rgb$1((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba$1(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba$1((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger$1.exec(format)) ? new Rgb$1(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent$1.exec(format)) ? new Rgb$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger$1.exec(format)) ? rgba$1(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent$1.exec(format)) ? rgba$1(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent$1.exec(format)) ? hsla$1(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named$1.hasOwnProperty(format) ? rgbn$1(named$1[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb$1(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn$1(n) {
      return new Rgb$1(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba$1(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb$1(r, g, b, a);
    }

    function rgbConvert$1(o) {
      if (!(o instanceof Color$1)) o = color$1(o);
      if (!o) return new Rgb$1;
      o = o.rgb();
      return new Rgb$1(o.r, o.g, o.b, o.opacity);
    }

    function rgb$3(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert$1(r) : new Rgb$1(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb$1(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define$1(Rgb$1, rgb$3, extend$1(Color$1, {
      brighter: function(k) {
        k = k == null ? brighter$1 : Math.pow(brighter$1, k);
        return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker$1 : Math.pow(darker$1, k);
        return new Rgb$1(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex$1, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex$1,
      formatRgb: rgb_formatRgb$1,
      toString: rgb_formatRgb$1
    }));

    function rgb_formatHex$1() {
      return "#" + hex$1(this.r) + hex$1(this.g) + hex$1(this.b);
    }

    function rgb_formatRgb$1() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex$1(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla$1(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl$1(h, s, l, a);
    }

    function hslConvert$1(o) {
      if (o instanceof Hsl$1) return new Hsl$1(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color$1)) o = color$1(o);
      if (!o) return new Hsl$1;
      if (o instanceof Hsl$1) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl$1(h, s, l, o.opacity);
    }

    function hsl$1(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert$1(h) : new Hsl$1(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl$1(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define$1(Hsl$1, hsl$1, extend$1(Color$1, {
      brighter: function(k) {
        k = k == null ? brighter$1 : Math.pow(brighter$1, k);
        return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker$1 : Math.pow(darker$1, k);
        return new Hsl$1(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb$1(
          hsl2rgb$1(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb$1(h, m1, m2),
          hsl2rgb$1(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb$1(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var constant$1 = x => () => x;

    function linear$2(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential$1(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma$1(y) {
      return (y = +y) === 1 ? nogamma$1 : function(a, b) {
        return b - a ? exponential$1(a, b, y) : constant$1(isNaN(a) ? b : a);
      };
    }

    function nogamma$1(a, b) {
      var d = b - a;
      return d ? linear$2(a, d) : constant$1(isNaN(a) ? b : a);
    }

    var rgb$2 = (function rgbGamma(y) {
      var color = gamma$1(y);

      function rgb(start, end) {
        var r = color((start = rgb$3(start)).r, (end = rgb$3(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma$1(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray$1(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray$1(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray$1(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate$2(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date$1(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object$2(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate$2(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA$1 = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB$1 = new RegExp(reA$1.source, "g");

    function zero$1(b) {
      return function() {
        return b;
      };
    }

    function one$1(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string$1(a, b) {
      var bi = reA$1.lastIndex = reB$1.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA$1.exec(a))
          && (bm = reB$1.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB$1.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one$1(q[0].x)
          : zero$1(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate$2(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant$1(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color$1(b)) ? (b = c, rgb$2) : string$1)
          : b instanceof color$1 ? rgb$2
          : b instanceof Date ? date$1
          : isNumberArray$1(b) ? numberArray$1
          : Array.isArray(b) ? genericArray$1
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object$2
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function constants(x) {
      return function() {
        return x;
      };
    }

    function number$1(x) {
      return +x;
    }

    var unit = [0, 1];

    function identity$3(x) {
      return x;
    }

    function normalize$1(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constants(isNaN(b) ? NaN : 0.5);
    }

    function clamper(a, b) {
      var t;
      if (a > b) t = a, a = b, b = t;
      return function(x) { return Math.max(a, Math.min(b, x)); };
    }

    // normalize(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // interpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding range value x in [a,b].
    function bimap(domain, range, interpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = normalize$1(d1, d0), r0 = interpolate(r1, r0);
      else d0 = normalize$1(d0, d1), r0 = interpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, interpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = normalize$1(domain[i], domain[i + 1]);
        r[i] = interpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisectRight(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp())
          .unknown(source.unknown());
    }

    function transformer() {
      var domain = unit,
          range = unit,
          interpolate = interpolate$2,
          transform,
          untransform,
          unknown,
          clamp = identity$3,
          piecewise,
          output,
          input;

      function rescale() {
        var n = Math.min(domain.length, range.length);
        if (clamp !== identity$3) clamp = clamper(domain[0], domain[n - 1]);
        piecewise = n > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return x == null || isNaN(x = +x) ? unknown : (output || (output = piecewise(domain.map(transform), range, interpolate)))(transform(clamp(x)));
      }

      scale.invert = function(y) {
        return clamp(untransform((input || (input = piecewise(range, domain.map(transform), interpolateNumber)))(y)));
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = Array.from(_, number$1), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = Array.from(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = Array.from(_), interpolate = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = _ ? true : identity$3, rescale()) : clamp !== identity$3;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate = _, rescale()) : interpolate;
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      return function(t, u) {
        transform = t, untransform = u;
        return rescale();
      };
    }

    function continuous() {
      return transformer()(identity$3, identity$3);
    }

    function formatDecimal(x) {
      return Math.abs(x = Math.round(x)) >= 1e21
          ? x.toLocaleString("en").replace(/,/g, "")
          : x.toString(10);
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimalParts(1.23) returns ["123", 0].
    function formatDecimalParts(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimalParts(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatNumerals(numerals) {
      return function(value) {
        return value.replace(/[0-9]/g, function(i) {
          return numerals[+i];
        });
      };
    }

    // [[fill]align][sign][symbol][0][width][,][.precision][~][type]
    var re = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);
      var match;
      return new FormatSpecifier({
        fill: match[1],
        align: match[2],
        sign: match[3],
        symbol: match[4],
        zero: match[5],
        width: match[6],
        comma: match[7],
        precision: match[8] && match[8].slice(1),
        trim: match[9],
        type: match[10]
      });
    }

    formatSpecifier.prototype = FormatSpecifier.prototype; // instanceof

    function FormatSpecifier(specifier) {
      this.fill = specifier.fill === undefined ? " " : specifier.fill + "";
      this.align = specifier.align === undefined ? ">" : specifier.align + "";
      this.sign = specifier.sign === undefined ? "-" : specifier.sign + "";
      this.symbol = specifier.symbol === undefined ? "" : specifier.symbol + "";
      this.zero = !!specifier.zero;
      this.width = specifier.width === undefined ? undefined : +specifier.width;
      this.comma = !!specifier.comma;
      this.precision = specifier.precision === undefined ? undefined : +specifier.precision;
      this.trim = !!specifier.trim;
      this.type = specifier.type === undefined ? "" : specifier.type + "";
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width === undefined ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision === undefined ? "" : "." + Math.max(0, this.precision | 0))
          + (this.trim ? "~" : "")
          + this.type;
    };

    // Trims insignificant zeros, e.g., replaces 1.2000k with 1.2k.
    function formatTrim(s) {
      out: for (var n = s.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (s[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          default: if (!+s[i]) break out; if (i0 > 0) i0 = 0; break;
        }
      }
      return i0 > 0 ? s.slice(0, i0) + s.slice(i1 + 1) : s;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimalParts(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimalParts(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "%": (x, p) => (x * 100).toFixed(p),
      "b": (x) => Math.round(x).toString(2),
      "c": (x) => x + "",
      "d": formatDecimal,
      "e": (x, p) => x.toExponential(p),
      "f": (x, p) => x.toFixed(p),
      "g": (x, p) => x.toPrecision(p),
      "o": (x) => Math.round(x).toString(8),
      "p": (x, p) => formatRounded(x * 100, p),
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": (x) => Math.round(x).toString(16).toUpperCase(),
      "x": (x) => Math.round(x).toString(16)
    };

    function identity$2(x) {
      return x;
    }

    var map$1 = Array.prototype.map,
        prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function formatLocale(locale) {
      var group = locale.grouping === undefined || locale.thousands === undefined ? identity$2 : formatGroup(map$1.call(locale.grouping, Number), locale.thousands + ""),
          currencyPrefix = locale.currency === undefined ? "" : locale.currency[0] + "",
          currencySuffix = locale.currency === undefined ? "" : locale.currency[1] + "",
          decimal = locale.decimal === undefined ? "." : locale.decimal + "",
          numerals = locale.numerals === undefined ? identity$2 : formatNumerals(map$1.call(locale.numerals, String)),
          percent = locale.percent === undefined ? "%" : locale.percent + "",
          minus = locale.minus === undefined ? "−" : locale.minus + "",
          nan = locale.nan === undefined ? "NaN" : locale.nan + "";

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            trim = specifier.trim,
            type = specifier.type;

        // The "n" type is an alias for ",g".
        if (type === "n") comma = true, type = "g";

        // The "" type, and any invalid type, is an alias for ".12~g".
        else if (!formatTypes[type]) precision === undefined && (precision = 12), trim = true, type = "g";

        // If zero fill is specified, padding goes after sign and before digits.
        if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currencyPrefix : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currencySuffix : /[%p]/.test(type) ? percent : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision === undefined ? 6
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Determine the sign. -0 is not less than 0, but 1 / -0 is!
            var valueNegative = value < 0 || 1 / value < 0;

            // Perform the initial formatting.
            value = isNaN(value) ? nan : formatType(Math.abs(value), precision);

            // Trim insignificant zeros.
            if (trim) value = formatTrim(value);

            // If a negative value rounds to zero after formatting, and no explicit positive sign is requested, hide the sign.
            if (valueNegative && +value === 0 && sign !== "+") valueNegative = false;

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : minus) : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + valueSuffix + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": value = valuePrefix + value + valueSuffix + padding; break;
            case "=": value = valuePrefix + padding + value + valueSuffix; break;
            case "^": value = padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length); break;
            default: value = padding + valuePrefix + value + valueSuffix; break;
          }

          return numerals(value);
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(start, stop, count, specifier) {
      var step = tickStep(start, stop, count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        var d = domain();
        return tickFormat(d[0], d[d.length - 1], count == null ? 10 : count, specifier);
      };

      scale.nice = function(count) {
        if (count == null) count = 10;

        var d = domain();
        var i0 = 0;
        var i1 = d.length - 1;
        var start = d[i0];
        var stop = d[i1];
        var prestep;
        var step;
        var maxIter = 10;

        if (stop < start) {
          step = start, start = stop, stop = step;
          step = i0, i0 = i1, i1 = step;
        }
        
        while (maxIter-- > 0) {
          step = tickIncrement(start, stop, count);
          if (step === prestep) {
            d[i0] = start;
            d[i1] = stop;
            return domain(d);
          } else if (step > 0) {
            start = Math.floor(start / step) * step;
            stop = Math.ceil(stop / step) * step;
          } else if (step < 0) {
            start = Math.ceil(start * step) / step;
            stop = Math.floor(stop * step) / step;
          } else {
            break;
          }
          prestep = step;
        }

        return scale;
      };

      return scale;
    }

    function linear$1() {
      var scale = continuous();

      scale.copy = function() {
        return copy(scale, linear$1());
      };

      initRange.apply(scale, arguments);

      return linearish(scale);
    }

    function createScales ({ scaleX, scaleY }, { rangeX, rangeY }) {
      return {
        scaleX: createScale(scaleX, rangeX),
        scaleY: createScale(scaleY, rangeY)
      }
    }
    function createScale (scale, range) {
      if (scale) {
        if (scale.constructor === Array) {
          return linear$1().domain(scale).range(range)
        }

        const newScale = scale.copy().range(range);
        newScale.invert = createInvertMethod(newScale);

        return newScale
      }

      if (!scale) {
        return linear$1().domain(range).range(range)
      }
    }

    /**
     * Taken from react-vis:
     * https://github.com/uber/react-vis/blob/master/src/utils/scales-utils.js#L161
     *
     * By default, d3.scaleBand and d3.scalePoint do not have an .invert method, which is why
     * we are doing this. There are some PRs open for this, though, so hopefully we can
     * get rid of this in the future:
     * - https://github.com/d3/d3-scale/pull/151
     * - https://github.com/d3/d3-scale/pull/60
     */
    function createInvertMethod (scale) {
      if (scale.invert) {
        return scale.invert
      }

      return function invert (value) {
        const [lower, upper] = scale.range();
        const start = Math.min(lower, upper);
        const stop = Math.max(lower, upper);

        const flipped = upper < lower;

        const domain = scale.domain();
        const lastIndex = domain.length - 1;

        if (value < start + scale.padding() * scale.step()) {
          return domain[0]
        }

        if (value > stop - scale.padding() * scale.step()) {
          return domain[lastIndex]
        }

        let index;

        if (isPointScale(scale)) {
          index = Math.round((value - start - scale.padding() * scale.step()) / scale.step());
        }

        if (isBandScale(scale)) {
          index = Math.round((value - start - scale.padding() * scale.step()) / scale.step());
          if (index > lastIndex) index = lastIndex;
        }

        return domain[flipped ? lastIndex - index : index]
      }
    }

    function isPointScale (scale) {
      return !('paddingInner' in scale)
    }

    function isBandScale (scale) {
      return 'paddingInner' in scale
    }

    function createFinalScales ({ rangeX, rangeY }, { finalRangeX, finalRangeY }) {
      const finalScaleX = linear$1().domain(rangeX).range(finalRangeX);
      const finalScaleY = linear$1().domain(rangeY).range(finalRangeY);

      return { finalScaleX, finalScaleY }
    }

    function createPolarTransformation (
      { rangeX, rangeY },
      { finalRangeX, finalRangeY }
    ) {
      const toTheta = linear$1().domain(rangeX).range([0, 2 * Math.PI]);
      const toRadius = linear$1().domain(rangeY).range([0, 1]);

      const fitX = linear$1().domain([-1, 1]).range(finalRangeX);
      const fitY = linear$1().domain([-1, 1]).range(finalRangeY);

      const transform = function transform ([x, y]) {
        const theta = toTheta(x);
        const radius = toRadius(y);
        const coords = polarToCartesian(theta, radius);

        return [fitX(coords[0]), fitY(coords[1])]
      };

      const invert = function invert ([x, y]) {
        const smallCoords = [fitX.invert(x), fitY.invert(y)];
        const [theta, radius] = cartesianToPolar(...smallCoords);

        return [toTheta.invert(theta), toRadius.invert(radius)]
      };

      transform.invert = invert;

      return transform
    }

    function polarToCartesian (theta, radius) {
      const x = radius * Math.sin(theta);
      const y = radius * Math.cos(theta);

      return [x, y]
    }

    // https://www.mathsisfun.com/polar-cartesian-coordinates.html
    function cartesianToPolar (x, y) {
      const quadrant = getQuadrant(x, y);

      const r = Math.sqrt(y ** 2 + x ** 2);
      let theta = Math.atan(x / y);

      if (quadrant === 2) {
        theta += Math.PI * 2;
      }

      if (quadrant === 3) {
        theta += Math.PI;
      }

      if (quadrant === 4) {
        theta += Math.PI;
      }

      return [theta, r]
    }

    function getQuadrant (x, y) {
      if (x >= 0 && y >= 0) return 1
      if (x < 0 && y >= 0) return 2
      if (x < 0 && y < 0) return 3
      if (x >= 0 && y < 0) return 4
    }

    function attachTransformations (sectionContext) {
      const {
        transformation,
        rangeX,
        rangeY,
        finalRangeX,
        finalRangeY,
        scaleX,
        scaleY,
        finalScaleX,
        finalScaleY
      } = sectionContext;

      if (transformation !== 'polar') {
        sectionContext.getTotalTransformation = needsScaling => {
          const { xNeedsScaling, yNeedsScaling } = parseNeedsScaling(needsScaling);

          return ([x, y]) => ([
            finalScaleX(xNeedsScaling ? scaleX(x) : x),
            finalScaleY(yNeedsScaling ? scaleY(y) : y)
          ])
        };

        sectionContext.inverseTotalTransformation = ([x, y]) => ([
          scaleX.invert(finalScaleX.invert(x)),
          scaleY.invert(finalScaleY.invert(y))
        ]);
      }

      if (transformation === 'polar') {
        const getScaleTransformation = needsScaling => {
          const { xNeedsScaling, yNeedsScaling } = parseNeedsScaling(needsScaling);

          return ([x, y]) => ([
            xNeedsScaling ? scaleX(x) : x,
            yNeedsScaling ? scaleY(y) : y
          ])
        };

        const postScaleTransformation = createPolarTransformation(
          { rangeX, rangeY },
          { finalRangeX, finalRangeY }
        );

        sectionContext.getScaleTransformation = getScaleTransformation;
        sectionContext.postScaleTransformation = postScaleTransformation;

        sectionContext.getTotalTransformation = needsScaling => {
          const scaleTransformation = getScaleTransformation(needsScaling);

          return point => (
            postScaleTransformation(scaleTransformation(point))
          )
        };

        const inverseScaleTransformation = ([x, y]) => ([
          scaleX.invert(x),
          scaleY.invert(y)
        ]);

        sectionContext.inverseTotalTransformation = point => (
          inverseScaleTransformation(postScaleTransformation.invert(point))
        );
      }
    }

    function parseNeedsScaling (needsScaling) {
      if (needsScaling === undefined) {
        return {
          xNeedsScaling: true,
          yNeedsScaling: true
        }
      }

      if (needsScaling.constructor === Boolean) {
        return {
          xNeedsScaling: needsScaling,
          yNeedsScaling: needsScaling
        }
      }

      if (needsScaling.constructor === Object) {
        return needsScaling
      }
    }

    function createSectionContext (sectionData) {
      sectionData.zoomIdentity = parseZoomIdentity(sectionData.zoomIdentity);

      const padding = parsePadding(sectionData.padding);
      const ranges = getRanges(sectionData);
      const finalRanges = getFinalRanges(sectionData, ranges, padding);
      const scales = createScales(sectionData, ranges);
      const finalScales = createFinalScales(ranges, finalRanges);

      const sectionContext = constructSectionContext(
        sectionData,
        padding,
        ranges,
        finalRanges,
        scales,
        finalScales
      );

      attachTransformations(sectionContext);

      return sectionContext
    }

    function parseZoomIdentity (zoomIdentity) {
      return Object.assign({ x: 0, y: 0, kx: 1, ky: 1 }, zoomIdentity)
    }

    function constructSectionContext (
      { scaleX, scaleY, padding: _, ...sectionData },
      padding,
      ranges,
      finalRanges,
      scales,
      finalScales
    ) {
      return {
        ...sectionData,
        padding,
        ...ranges,
        ...finalRanges,
        ...scales,
        ...finalScales,
        bbox: getBbox(ranges),
        paddedBbox: getPaddedBbox(ranges, padding)
      }
    }

    function getBbox ({ rangeX, rangeY }) {
      return {
        minX: Math.min(...rangeX),
        maxX: Math.max(...rangeX),
        minY: Math.min(...rangeY),
        maxY: Math.max(...rangeY)
      }
    }

    function getPaddedBbox ({ rangeX, rangeY }, { left, right, top, bottom }) {
      return {
        minX: Math.min(...rangeX) + left,
        maxX: Math.max(...rangeX) - right,
        minY: Math.min(...rangeY) + top,
        maxY: Math.max(...rangeY) - bottom
      }
    }

    const key$2 = {};

    function subscribe$2 () {
      return getContext(key$2)
    }

    function init$2 () {
      const sectionContext = writable();
      setContext(key$2, sectionContext);

      return sectionContext
    }

    function update$2 (sectionContext, options) {
      sectionContext.set(createSectionContext(options));
    }

    var SectionContext = /*#__PURE__*/Object.freeze({
        __proto__: null,
        subscribe: subscribe$2,
        init: init$2,
        update: update$2
    });

    const key$1 = {};

    function subscribe$1 () {
      return getContext(key$1)
    }

    function init$1 () {
      const eventManagerContext = writable();
      setContext(key$1, eventManagerContext);

      return eventManagerContext
    }

    function update$1 (eventManagerContext, eventManager) {
      eventManagerContext.set(eventManager);
    }

    var EventManagerContext = /*#__PURE__*/Object.freeze({
        __proto__: null,
        subscribe: subscribe$1,
        init: init$1,
        update: update$1
    });

    const key = {};

    function subscribe () {
      return getContext(key)
    }

    function init () {
      const interactionManagerContext = writable();
      setContext(key, interactionManagerContext);

      return interactionManagerContext
    }

    function update (interactionManagerContext, interactionManager) {
      interactionManagerContext.set(interactionManager);
    }

    var InteractionManagerContext = /*#__PURE__*/Object.freeze({
        __proto__: null,
        subscribe: subscribe,
        init: init,
        update: update
    });

    let handler;

    class EventTracker {
      constructor (eventManager, { eventName, nativeEventName, useWindow, preventDefault }) {
        this._eventManager = eventManager;
        this._eventName = eventName;
        this._nativeEventName = nativeEventName;
        this._useWindow = useWindow;
        this._preventDefault = preventDefault;

        this._numberOfActiveListeners = 0;
        this._callbacks = {};
      }

      setNativeEventName (nativeEventName) {
        this._nativeEventName = nativeEventName;
      }

      addListener (listenerId, callback) {
        this._callbacks[listenerId] = callback;

        if (this._eventManagerHasBeenMounted()) {
          this._attachNativeListenerIfNecessary();
        }
      }

      attachAllListeners () {
        /* eslint-disable-next-line */
        for (const _ in this._callbacks) {
          this._attachNativeListenerIfNecessary();
        }
      }

      removeListener (listenerId) {
        delete this._callbacks[listenerId];

        if (this._eventManagerHasBeenMounted()) {
          this._removeNativeListenerIfNecessary();
        }
      }

      _eventManagerHasBeenMounted () {
        return this._eventManager._mounted
      }

      _attachNativeListenerIfNecessary () {
        if (this._numberOfActiveListeners === 0) {
          handler = this._handleEvent.bind(this);
          const nativeEventName = this._nativeEventName;

          if (this._useWindow) {
            window.addEventListener(nativeEventName, handler);
          }

          if (!this._useWindow) {
            this._eventManager._domNode.addEventListener(nativeEventName, handler);
          }
        }

        this._numberOfActiveListeners++;
      }

      _removeNativeListenerIfNecessary () {
        this._numberOfActiveListeners--;

        if (this._numberOfActiveListeners === 0) {
          const nativeEventName = this._nativeEventName;

          if (this._useWindow) {
            window.removeEventListener(nativeEventName, handler);
          }

          if (!this._useWindow) {
            this._eventManager._domNode.removeEventListener(nativeEventName, handler);
          }
        }
      }

      _handleEvent (nativeEvent) {
        if (this._preventDefault) nativeEvent.preventDefault();

        const screenCoordinates = this._getScreenCoordinates(nativeEvent);
        nativeEvent.eventName = this._eventName;

        for (const listenerId in this._callbacks) {
          this._callbacks[listenerId](screenCoordinates, nativeEvent);
        }
      }

      _getScreenCoordinates (nativeEvent) {
        return this._eventManager._getScreenCoordinates(nativeEvent)
      }
    }

    class BaseEventManager {
      constructor (EXPOSED_EVENTS, managerType) {
        this._domNode = undefined;
        this._svgPoint = undefined;
        this._mounted = false;
        this._trackers = {};
        this._BROWSER_TYPE = undefined;
        this._managerType = managerType;

        for (const event of EXPOSED_EVENTS) {
          this._trackers[event.eventName] = new EventTracker(this, event);
        }
      }

      // Svelte can only bind to DOM nodes after initialization
      addRootNode (domNode) {
        this._domNode = domNode;
        this._svgPoint = this._domNode.createSVGPoint();

        // set browser type only after mount
        this._BROWSER_TYPE = window.navigator.pointerEnabled
          ? 'IE11 / MSEdge'
          : window.navigator.msPointerEnabled
            ? 'IE10 / WP8'
            : 'other';

        this._mounted = true;
      }

      attachEventListeners () {
        if (this._mounted === false) throw new Error('root node must be added first')

        for (const eventName in this._trackers) {
          // set native event names here, just before attaching actual listeners
          if (this._managerType === 'mouse') {
            this._trackers[eventName].setNativeEventName(this._getNativeMouseEventName(eventName, this._BROWSER_TYPE));
          }
          if (this._managerType === 'touch') {
            this._trackers[eventName].setNativeEventName(this._getNativeTouchEventName(eventName, this._BROWSER_TYPE));
          }

          this._trackers[eventName].attachAllListeners();
        }
      }

      eventTracker (eventName) {
        return this._trackers[eventName]
      }
    }

    var capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    class MouseEventManager extends BaseEventManager {
      constructor () {
        super(EXPOSED_EVENTS$1, 'mouse');
      }

      _getNativeMouseEventName (exposedEventName, BROWSER_TYPE) {
        // 'click' has the same name in every non-mobile browser
        if (exposedEventName === 'click') return 'click'

        // 'wheel' has the same name in every non-mobile browser
        if (exposedEventName === 'wheel') return 'wheel'

        // In this non-mobile browser type, events are called 'pointerup' etc
        if (BROWSER_TYPE === 'IE11 / MSEdge') {
          const lastPart = sliceOffMouse(exposedEventName);
          return 'pointer' + lastPart
        }

        // In this non-mobile browser type, events are called 'MSPointerUp' etc
        if (BROWSER_TYPE === 'IE10 / WP8') {
          const lastPart = sliceOffMouse(exposedEventName);
          return 'MSPointer' + capitalize(lastPart)
        }

        // In other non-mobile browsers, events are called like the exposed ones
        if (BROWSER_TYPE === 'other') {
          return exposedEventName
        }
      }

      _getScreenCoordinates (nativeEvent) {
        this._svgPoint.x = nativeEvent.clientX;
        this._svgPoint.y = nativeEvent.clientY;

        return this._svgPoint.matrixTransform(this._domNode.getScreenCTM().inverse())
      }
    }

    const EVENT_NAMES$1 = ['mousedown', 'mouseup', 'mousemove', 'mouseout', 'click', 'wheel'];
    const WINDOW_EVENTS = ['mousemove', 'mouseup'];
    const PREVENT_DEFAULT = ['mousedown'];

    const EXPOSED_EVENTS$1 = EVENT_NAMES$1.map(eventName => ({
      eventName,
      nativeEventName: undefined,
      useWindow: WINDOW_EVENTS.includes(eventName),
      preventDefault: PREVENT_DEFAULT.includes(eventName)
    }));

    const sliceOffMouse = str => str.slice(5, str.length);

    class TouchEventManager extends BaseEventManager {
      constructor () {
        super(EXPOSED_EVENTS, 'touch');
      }

      _getNativeTouchEventName (exposedEventName, BROWSER_TYPE) {
        // In this mobile browser type, events are called 'pointerup' etc
        if (BROWSER_TYPE === 'IE11 / MSEdge') {
          const lastPart = sliceOffTouch(exposedEventName);
          return 'pointer' + lastPart
        }

        // In this mobile browser type, events are called 'MSPointerUp' etc
        if (BROWSER_TYPE === 'IE10 / WP8') {
          const lastPart = sliceOffTouch(exposedEventName);
          return 'MSPointer' + capitalize(lastPart)
        }

        // In other mobile browsers, events are called like the exposed ones
        if (BROWSER_TYPE === 'other') {
          return exposedEventName
        }
      }

      _getScreenCoordinates (nativeEvent) {
        const touches = getTouches(nativeEvent);

        if (touches.length === 1) {
          return this._getScreenCoordinatesSingle(touches[0])
        }

        if (touches.length > 1) {
          return this._getScreenCoordinatesMulti(touches)
        }
      }

      _getScreenCoordinatesSingle (touch) {
        this._svgPoint.x = touch.clientX;
        this._svgPoint.y = touch.clientY;

        return this._svgPoint.matrixTransform(this._domNode.getScreenCTM().inverse())
      }

      _getScreenCoordinatesMulti (touches) {
        const touchesInScreenCoordinates = [];

        for (const touch of touches) {
          touchesInScreenCoordinates.push(this._getScreenCoordinatesSingle(touch));
        }

        return touchesInScreenCoordinates
      }
    }

    const EVENT_NAMES = ['touchstart', 'touchend', 'touchmove', 'touchcancel'];

    const EXPOSED_EVENTS = EVENT_NAMES.map(eventName => ({
      eventName,
      nativeEventName: undefined,
      useWindow: false,
      preventDefault: true
    }));

    const sliceOffTouch = str => str.slice(5, str.length);

    function getTouches (nativeEvent) {
      return nativeEvent.touches
    }

    class EventManager {
      constructor () {
        if (primaryInput === 'mouse') {
          this._mouseEventManager = new MouseEventManager();
        }

        if (primaryInput === 'touch') {
          this._touchEventManager = new TouchEventManager();
        }
      }

      // Initialization
      addRootNode (domNode) {
        this._forEachManager(manager => { manager.addRootNode(domNode); });
      }

      attachEventListeners () {
        this._forEachManager(manager => { manager.attachEventListeners(); });
      }

      mouse () {
        return this._mouseEventManager
      }

      touch () {
        return this._touchEventManager
      }

      _forEachManager (callback) {
        if (this._mouseEventManager) callback(this._mouseEventManager);
        if (this._touchEventManager) callback(this._touchEventManager);
      }
    }

    class BaseInteractionManager {
      constructor () {
        this._id = undefined;
        this._eventManager = undefined;

        this._section = undefined;

        this._markInteractionInterface = undefined;
        this._sectionInteractionInterface = undefined;
      }

      // Initialization
      setId (id) {
        this._id = id;
      }

      linkEventManager (eventManager) {
        this._eventManager = eventManager;
      }

      // Section context loading
      loadSection (sectionData) {
        this._section = sectionData;
      }

      // Mark and layer interactions interface
      marks () {
        return this._markInteractionInterface
      }

      // Section interactions interface
      section () {
        return this._sectionInteractionInterface
      }
    }

    class BaseInteractionInterface {
      constructor (interactionManager, InteractionHandlers) {
        this._interactionManager = interactionManager;
        this._handlers = {};

        for (const handlerName in InteractionHandlers) {
          this._handlers[handlerName] = new InteractionHandlers[handlerName](this._interactionManager);
        }
      }

      _getHandler (interactionName) {
        const handlerName = interactionNameToHandlerName(interactionName);
        return this._handlers[handlerName]
      }
    }

    const interactionNameToHandlerName = interactionName => {
      return capitalize(interactionName) + 'Handler'
    };

    function indexPoint$1 (markData) {
      const pointAttributes = markData.attributes;

      const item = calculateBboxPoint(pointAttributes);

      item.attributes = pointAttributes;
      item.markType = 'Point';
      item.markId = markData.markId;

      return item
    }

    function indexPointLayer$1 ({ layerAttributes, keyArray, layerId }) {
      const items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        const pointAttributes = getPointAttributes$1(layerAttributes, key);
        const item = calculateBboxPoint(pointAttributes);

        item.key = key;
        item.index = i;
        item.attributes = pointAttributes;
        item.markType = 'Point';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function calculateBboxPoint (pointAttributes) {
      const x = pointAttributes.pixelGeometry.coordinates[0];
      const y = pointAttributes.pixelGeometry.coordinates[1];

      return {
        minX: x - pointAttributes.radius,
        maxX: x + pointAttributes.radius,
        minY: y - pointAttributes.radius,
        maxY: y + pointAttributes.radius
      }
    }

    function getPointAttributes$1 (layerAttributes, key) {
      return {
        pixelGeometry: layerAttributes.pixelGeometryObject[key],
        radius: layerAttributes.radiusObject[key]
      }
    }

    var pi = Math.PI;
    var tau = pi * 2;

    var abs = Math.abs;
    var sqrt = Math.sqrt;

    function noop() {}

    function streamGeometry(geometry, stream) {
      if (geometry && streamGeometryType.hasOwnProperty(geometry.type)) {
        streamGeometryType[geometry.type](geometry, stream);
      }
    }

    var streamObjectType = {
      Feature: function(object, stream) {
        streamGeometry(object.geometry, stream);
      },
      FeatureCollection: function(object, stream) {
        var features = object.features, i = -1, n = features.length;
        while (++i < n) streamGeometry(features[i].geometry, stream);
      }
    };

    var streamGeometryType = {
      Sphere: function(object, stream) {
        stream.sphere();
      },
      Point: function(object, stream) {
        object = object.coordinates;
        stream.point(object[0], object[1], object[2]);
      },
      MultiPoint: function(object, stream) {
        var coordinates = object.coordinates, i = -1, n = coordinates.length;
        while (++i < n) object = coordinates[i], stream.point(object[0], object[1], object[2]);
      },
      LineString: function(object, stream) {
        streamLine(object.coordinates, stream, 0);
      },
      MultiLineString: function(object, stream) {
        var coordinates = object.coordinates, i = -1, n = coordinates.length;
        while (++i < n) streamLine(coordinates[i], stream, 0);
      },
      Polygon: function(object, stream) {
        streamPolygon(object.coordinates, stream);
      },
      MultiPolygon: function(object, stream) {
        var coordinates = object.coordinates, i = -1, n = coordinates.length;
        while (++i < n) streamPolygon(coordinates[i], stream);
      },
      GeometryCollection: function(object, stream) {
        var geometries = object.geometries, i = -1, n = geometries.length;
        while (++i < n) streamGeometry(geometries[i], stream);
      }
    };

    function streamLine(coordinates, stream, closed) {
      var i = -1, n = coordinates.length - closed, coordinate;
      stream.lineStart();
      while (++i < n) coordinate = coordinates[i], stream.point(coordinate[0], coordinate[1], coordinate[2]);
      stream.lineEnd();
    }

    function streamPolygon(coordinates, stream) {
      var i = -1, n = coordinates.length;
      stream.polygonStart();
      while (++i < n) streamLine(coordinates[i], stream, 1);
      stream.polygonEnd();
    }

    function geoStream(object, stream) {
      if (object && streamObjectType.hasOwnProperty(object.type)) {
        streamObjectType[object.type](object, stream);
      } else {
        streamGeometry(object, stream);
      }
    }

    var identity$1 = x => x;

    var areaSum = new Adder(),
        areaRingSum = new Adder(),
        x00$2,
        y00$2,
        x0$3,
        y0$3;

    var areaStream = {
      point: noop,
      lineStart: noop,
      lineEnd: noop,
      polygonStart: function() {
        areaStream.lineStart = areaRingStart;
        areaStream.lineEnd = areaRingEnd;
      },
      polygonEnd: function() {
        areaStream.lineStart = areaStream.lineEnd = areaStream.point = noop;
        areaSum.add(abs(areaRingSum));
        areaRingSum = new Adder();
      },
      result: function() {
        var area = areaSum / 2;
        areaSum = new Adder();
        return area;
      }
    };

    function areaRingStart() {
      areaStream.point = areaPointFirst;
    }

    function areaPointFirst(x, y) {
      areaStream.point = areaPoint;
      x00$2 = x0$3 = x, y00$2 = y0$3 = y;
    }

    function areaPoint(x, y) {
      areaRingSum.add(y0$3 * x - x0$3 * y);
      x0$3 = x, y0$3 = y;
    }

    function areaRingEnd() {
      areaPoint(x00$2, y00$2);
    }

    var x0$2 = Infinity,
        y0$2 = x0$2,
        x1 = -x0$2,
        y1 = x1;

    var boundsStream = {
      point: boundsPoint,
      lineStart: noop,
      lineEnd: noop,
      polygonStart: noop,
      polygonEnd: noop,
      result: function() {
        var bounds = [[x0$2, y0$2], [x1, y1]];
        x1 = y1 = -(y0$2 = x0$2 = Infinity);
        return bounds;
      }
    };

    function boundsPoint(x, y) {
      if (x < x0$2) x0$2 = x;
      if (x > x1) x1 = x;
      if (y < y0$2) y0$2 = y;
      if (y > y1) y1 = y;
    }

    // TODO Enforce positive area for exterior, negative area for interior?

    var X0 = 0,
        Y0 = 0,
        Z0 = 0,
        X1 = 0,
        Y1 = 0,
        Z1 = 0,
        X2 = 0,
        Y2 = 0,
        Z2 = 0,
        x00$1,
        y00$1,
        x0$1,
        y0$1;

    var centroidStream = {
      point: centroidPoint,
      lineStart: centroidLineStart,
      lineEnd: centroidLineEnd,
      polygonStart: function() {
        centroidStream.lineStart = centroidRingStart;
        centroidStream.lineEnd = centroidRingEnd;
      },
      polygonEnd: function() {
        centroidStream.point = centroidPoint;
        centroidStream.lineStart = centroidLineStart;
        centroidStream.lineEnd = centroidLineEnd;
      },
      result: function() {
        var centroid = Z2 ? [X2 / Z2, Y2 / Z2]
            : Z1 ? [X1 / Z1, Y1 / Z1]
            : Z0 ? [X0 / Z0, Y0 / Z0]
            : [NaN, NaN];
        X0 = Y0 = Z0 =
        X1 = Y1 = Z1 =
        X2 = Y2 = Z2 = 0;
        return centroid;
      }
    };

    function centroidPoint(x, y) {
      X0 += x;
      Y0 += y;
      ++Z0;
    }

    function centroidLineStart() {
      centroidStream.point = centroidPointFirstLine;
    }

    function centroidPointFirstLine(x, y) {
      centroidStream.point = centroidPointLine;
      centroidPoint(x0$1 = x, y0$1 = y);
    }

    function centroidPointLine(x, y) {
      var dx = x - x0$1, dy = y - y0$1, z = sqrt(dx * dx + dy * dy);
      X1 += z * (x0$1 + x) / 2;
      Y1 += z * (y0$1 + y) / 2;
      Z1 += z;
      centroidPoint(x0$1 = x, y0$1 = y);
    }

    function centroidLineEnd() {
      centroidStream.point = centroidPoint;
    }

    function centroidRingStart() {
      centroidStream.point = centroidPointFirstRing;
    }

    function centroidRingEnd() {
      centroidPointRing(x00$1, y00$1);
    }

    function centroidPointFirstRing(x, y) {
      centroidStream.point = centroidPointRing;
      centroidPoint(x00$1 = x0$1 = x, y00$1 = y0$1 = y);
    }

    function centroidPointRing(x, y) {
      var dx = x - x0$1,
          dy = y - y0$1,
          z = sqrt(dx * dx + dy * dy);

      X1 += z * (x0$1 + x) / 2;
      Y1 += z * (y0$1 + y) / 2;
      Z1 += z;

      z = y0$1 * x - x0$1 * y;
      X2 += z * (x0$1 + x);
      Y2 += z * (y0$1 + y);
      Z2 += z * 3;
      centroidPoint(x0$1 = x, y0$1 = y);
    }

    function PathContext(context) {
      this._context = context;
    }

    PathContext.prototype = {
      _radius: 4.5,
      pointRadius: function(_) {
        return this._radius = _, this;
      },
      polygonStart: function() {
        this._line = 0;
      },
      polygonEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line === 0) this._context.closePath();
        this._point = NaN;
      },
      point: function(x, y) {
        switch (this._point) {
          case 0: {
            this._context.moveTo(x, y);
            this._point = 1;
            break;
          }
          case 1: {
            this._context.lineTo(x, y);
            break;
          }
          default: {
            this._context.moveTo(x + this._radius, y);
            this._context.arc(x, y, this._radius, 0, tau);
            break;
          }
        }
      },
      result: noop
    };

    var lengthSum = new Adder(),
        lengthRing,
        x00,
        y00,
        x0,
        y0;

    var lengthStream = {
      point: noop,
      lineStart: function() {
        lengthStream.point = lengthPointFirst;
      },
      lineEnd: function() {
        if (lengthRing) lengthPoint(x00, y00);
        lengthStream.point = noop;
      },
      polygonStart: function() {
        lengthRing = true;
      },
      polygonEnd: function() {
        lengthRing = null;
      },
      result: function() {
        var length = +lengthSum;
        lengthSum = new Adder();
        return length;
      }
    };

    function lengthPointFirst(x, y) {
      lengthStream.point = lengthPoint;
      x00 = x0 = x, y00 = y0 = y;
    }

    function lengthPoint(x, y) {
      x0 -= x, y0 -= y;
      lengthSum.add(sqrt(x0 * x0 + y0 * y0));
      x0 = x, y0 = y;
    }

    function PathString() {
      this._string = [];
    }

    PathString.prototype = {
      _radius: 4.5,
      _circle: circle(4.5),
      pointRadius: function(_) {
        if ((_ = +_) !== this._radius) this._radius = _, this._circle = null;
        return this;
      },
      polygonStart: function() {
        this._line = 0;
      },
      polygonEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line === 0) this._string.push("Z");
        this._point = NaN;
      },
      point: function(x, y) {
        switch (this._point) {
          case 0: {
            this._string.push("M", x, ",", y);
            this._point = 1;
            break;
          }
          case 1: {
            this._string.push("L", x, ",", y);
            break;
          }
          default: {
            if (this._circle == null) this._circle = circle(this._radius);
            this._string.push("M", x, ",", y, this._circle);
            break;
          }
        }
      },
      result: function() {
        if (this._string.length) {
          var result = this._string.join("");
          this._string = [];
          return result;
        } else {
          return null;
        }
      }
    };

    function circle(radius) {
      return "m0," + radius
          + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius
          + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius
          + "z";
    }

    function geoPath(projection, context) {
      var pointRadius = 4.5,
          projectionStream,
          contextStream;

      function path(object) {
        if (object) {
          if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
          geoStream(object, projectionStream(contextStream));
        }
        return contextStream.result();
      }

      path.area = function(object) {
        geoStream(object, projectionStream(areaStream));
        return areaStream.result();
      };

      path.measure = function(object) {
        geoStream(object, projectionStream(lengthStream));
        return lengthStream.result();
      };

      path.bounds = function(object) {
        geoStream(object, projectionStream(boundsStream));
        return boundsStream.result();
      };

      path.centroid = function(object) {
        geoStream(object, projectionStream(centroidStream));
        return centroidStream.result();
      };

      path.projection = function(_) {
        return arguments.length ? (projectionStream = _ == null ? (projection = null, identity$1) : (projection = _).stream, path) : projection;
      };

      path.context = function(_) {
        if (!arguments.length) return context;
        contextStream = _ == null ? (context = null, new PathString) : new PathContext(context = _);
        if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
        return path;
      };

      path.pointRadius = function(_) {
        if (!arguments.length) return pointRadius;
        pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
        return path;
      };

      return path.projection(projection).context(context);
    }

    function isInvalid (value) {
      if (value === undefined || value === null) { return true }

      if (value.constructor === Number) {
        return !isFinite(value)
      }

      return false
    }

    function isDefined (value) {
      return value !== undefined
    }

    function isUndefined (value) {
      return value === undefined
    }

    function calculateBboxGeometry (geometry) {
      const bbox = path.bounds(geometry);

      const bboxObj = {
        x: [bbox[0][0], bbox[1][0]],
        y: [bbox[0][1], bbox[1][1]]
      };

      return bboxObj
    }

    const path = geoPath();

    function isLinearRing$1 (ring) {
      return ring.constructor === Array
    }

    function isPolygon$1 (geometry) {
      return geometry.constructor === Object && geometry.type === 'Polygon'
    }

    function isMultiPolygon$1 (geometry) {
      return geometry.constructor === Object && geometry.type === 'MultiPolygon'
    }

    function isLineString$1 (geometry) {
      return geometry.constructor === Object && geometry.type === 'LineString'
    }

    function isMultiLineString$1 (geometry) {
      return geometry.constructor === Object && geometry.type === 'MultiLineString'
    }

    function polygonArea$1 (polygon) {
      if (isLinearRing$1(polygon)) {
        return getRingArea$1(polygon)
      }

      if (isPolygon$1(polygon)) {
        return getPolygonArea$1(polygon)
      }

      if (isMultiPolygon$1(polygon)) {
        return getMultiPolygonArea$1(polygon)
      }

      throw new Error('Invalid input')
    }

    function getRingArea$1 (ring) {
      return Math.abs(getSignedRingArea$1(ring))
    }

    // Taken from: https://stackoverflow.com/a/33670691/7237112
    function getSignedRingArea$1 (ring) {
      let total = 0;

      for (let i = 0, l = ring.length; i < l; i++) {
        const addX = ring[i][0];
        const addY = ring[i === ring.length - 1 ? 0 : i + 1][1];
        const subX = ring[i === ring.length - 1 ? 0 : i + 1][0];
        const subY = ring[i][1];

        total += (addX * addY * 0.5);
        total -= (subX * subY * 0.5);
      }

      return total
    }

    function getPolygonArea$1 (polygon) {
      let totalArea = getRingArea$1(polygon.coordinates[0]);

      for (let i = 1; i < polygon.coordinates.length; i++) {
        const holeArea = getRingArea$1(polygon.coordinates[i]);
        totalArea -= holeArea;
      }

      return totalArea
    }

    function getMultiPolygonArea$1 (multiPolygon) {
      let totalArea = 0;

      for (let i = 0; i < multiPolygon.coordinates.length; i++) {
        totalArea += getPolygonArea$1(multiPolygon.coordinates[i]);
      }

      return totalArea
    }

    function pointDistance$2 (point1, point2) {
      return Math.sqrt(
        (point1[0] - point2[0]) ** 2 +
        (point1[1] - point2[1]) ** 2
      )
    }

    function linearRingLength$1 (linearRing) {
      let totalLength = 0;

      for (let i = 0; i < linearRing.length - 1; i++) {
        const from = linearRing[i];
        const to = linearRing[i + 1];

        totalLength += pointDistance$2(from, to);
      }

      return totalLength
    }

    function calculateCentroid$1 (geometry) {
      if (isLinearRing$1(geometry)) {
        return calculateLinearRingCentroid$1(geometry)
      }

      if (isPolygon$1(geometry)) {
        return calculatePolygonCentroid$1(geometry)
      }

      if (isMultiPolygon$1(geometry)) {
        return calculateMultiPolygonCentroid$1(geometry)
      }

      if (isLineString$1(geometry)) {
        return calculateLineStringCentroid(geometry)
      }

      if (isMultiLineString$1(geometry)) {
        return calculateMultiLineStringCentroid(geometry)
      }
    }

    // https://stackoverflow.com/a/33852627/7237112
    function calculateLinearRingCentroid$1 (ring) {
      const nPts = ring.length;
      const off = ring[0];
      let twicearea = 0;
      let x = 0;
      let y = 0;
      let p1;
      let p2;
      let f;

      for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = ring[i];
        p2 = ring[j];
        f = (p1[0] - off[0]) * (p2[1] - off[1]) - (p2[0] - off[0]) * (p1[1] - off[1]);
        twicearea += f;
        x += (p1[0] + p2[0] - 2 * off[0]) * f;
        y += (p1[1] + p2[1] - 2 * off[1]) * f;
      }

      f = twicearea * 3;

      return [x / f + off[0], y / f + off[1]]
    }

    function calculatePolygonCentroid$1 (polygon) {
      // We will ignore holes and just take the outer ring
      return calculateLinearRingCentroid$1(polygon.coordinates[0])
    }

    function calculateMultiPolygonCentroid$1 (multiPolygon) {
      // We will take the centroid of each polygon (ignoring holes)
      // and take the weighted (by area) center of these.
      let x = 0;
      let y = 0;
      let totalArea = 0;

      for (let i = 0; i < multiPolygon.coordinates.length; i++) {
        const polygon = multiPolygon.coordinates[i];
        const polygonCentroid = calculateLinearRingCentroid$1(polygon[0]);
        const area = polygonArea$1(polygon[0]);

        x += polygonCentroid[0] * area;
        y += polygonCentroid[1] * area;
        totalArea += area;
      }

      return [x / totalArea, y / totalArea]
    }

    function calculateLineStringCentroid (lineString) {
      return calculateLinearRingCentroid$1(lineString.coordinates)
    }

    function calculateMultiLineStringCentroid (multiLineString) {
      // We will take the centroid of each LineString
      // and take the weighted (by length) center of these.
      let x = 0;
      let y = 0;
      let totalLength = 0;

      for (let i = 0; i < multiLineString.coordinates.length; i++) {
        const lineString = multiLineString.coordinates[i];
        const lineStringCentroid = calculateLinearRingCentroid$1(lineString);
        const length = linearRingLength$1(lineString);

        x += lineStringCentroid[0] * length;
        y += lineStringCentroid[1] * length;
        totalLength += length;
      }

      return [x / totalLength, y / totalLength]
    }

    function pointIntersectsLineSegment (point, lineSegment, lineWidth) {
      const distance = distanceClosestPointOnLineSegment(point, lineSegment);

      return distance < (lineWidth / 2)
    }

    function distanceClosestPointOnLineSegment (point, lineSegment) {
      const closestPoint = closestPointOnLineSegment(point, lineSegment);
      return pointDistance$2(point, closestPoint)
    }

    // https://stackoverflow.com/a/6853926/7237112
    function closestPointOnLineSegment (point, lineSegment) {
      // Point coordinates
      const x = point[0];
      const y = point[1];

      // Line segment coordinates
      const x1 = lineSegment[0][0];
      const y1 = lineSegment[0][1];
      const x2 = lineSegment[1][0];
      const y2 = lineSegment[1][1];

      const A = x - x1;
      const B = y - y1;
      const C = x2 - x1;
      const D = y2 - y1;

      const dot = A * C + B * D;
      const lengthSquared = C * C + D * D;
      let param = -1;
      if (lengthSquared !== 0) { // in case of 0 length line
        param = dot / lengthSquared;
      }

      let xx, yy;

      if (param < 0) {
        xx = x1;
        yy = y1;
      } else if (param > 1) {
        xx = x2;
        yy = y2;
      } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
      }

      return [xx, yy]
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var twoProduct_1 = twoProduct;

    var SPLITTER = +(Math.pow(2, 27) + 1.0);

    function twoProduct(a, b, result) {
      var x = a * b;

      var c = SPLITTER * a;
      var abig = c - a;
      var ahi = c - abig;
      var alo = a - ahi;

      var d = SPLITTER * b;
      var bbig = d - b;
      var bhi = d - bbig;
      var blo = b - bhi;

      var err1 = x - (ahi * bhi);
      var err2 = err1 - (alo * bhi);
      var err3 = err2 - (ahi * blo);

      var y = alo * blo - err3;

      if(result) {
        result[0] = y;
        result[1] = x;
        return result
      }

      return [ y, x ]
    }

    var robustSum = linearExpansionSum;

    //Easy case: Add two scalars
    function scalarScalar$1(a, b) {
      var x = a + b;
      var bv = x - a;
      var av = x - bv;
      var br = b - bv;
      var ar = a - av;
      var y = ar + br;
      if(y) {
        return [y, x]
      }
      return [x]
    }

    function linearExpansionSum(e, f) {
      var ne = e.length|0;
      var nf = f.length|0;
      if(ne === 1 && nf === 1) {
        return scalarScalar$1(e[0], f[0])
      }
      var n = ne + nf;
      var g = new Array(n);
      var count = 0;
      var eptr = 0;
      var fptr = 0;
      var abs = Math.abs;
      var ei = e[eptr];
      var ea = abs(ei);
      var fi = f[fptr];
      var fa = abs(fi);
      var a, b;
      if(ea < fa) {
        b = ei;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
          ea = abs(ei);
        }
      } else {
        b = fi;
        fptr += 1;
        if(fptr < nf) {
          fi = f[fptr];
          fa = abs(fi);
        }
      }
      if((eptr < ne && ea < fa) || (fptr >= nf)) {
        a = ei;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
          ea = abs(ei);
        }
      } else {
        a = fi;
        fptr += 1;
        if(fptr < nf) {
          fi = f[fptr];
          fa = abs(fi);
        }
      }
      var x = a + b;
      var bv = x - a;
      var y = b - bv;
      var q0 = y;
      var q1 = x;
      var _x, _bv, _av, _br, _ar;
      while(eptr < ne && fptr < nf) {
        if(ea < fa) {
          a = ei;
          eptr += 1;
          if(eptr < ne) {
            ei = e[eptr];
            ea = abs(ei);
          }
        } else {
          a = fi;
          fptr += 1;
          if(fptr < nf) {
            fi = f[fptr];
            fa = abs(fi);
          }
        }
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        }
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
      }
      while(eptr < ne) {
        a = ei;
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        }
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
        }
      }
      while(fptr < nf) {
        a = fi;
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        } 
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
        fptr += 1;
        if(fptr < nf) {
          fi = f[fptr];
        }
      }
      if(q0) {
        g[count++] = q0;
      }
      if(q1) {
        g[count++] = q1;
      }
      if(!count) {
        g[count++] = 0.0;  
      }
      g.length = count;
      return g
    }

    var twoSum = fastTwoSum;

    function fastTwoSum(a, b, result) {
    	var x = a + b;
    	var bv = x - a;
    	var av = x - bv;
    	var br = b - bv;
    	var ar = a - av;
    	if(result) {
    		result[0] = ar + br;
    		result[1] = x;
    		return result
    	}
    	return [ar+br, x]
    }

    var robustScale = scaleLinearExpansion;

    function scaleLinearExpansion(e, scale) {
      var n = e.length;
      if(n === 1) {
        var ts = twoProduct_1(e[0], scale);
        if(ts[0]) {
          return ts
        }
        return [ ts[1] ]
      }
      var g = new Array(2 * n);
      var q = [0.1, 0.1];
      var t = [0.1, 0.1];
      var count = 0;
      twoProduct_1(e[0], scale, q);
      if(q[0]) {
        g[count++] = q[0];
      }
      for(var i=1; i<n; ++i) {
        twoProduct_1(e[i], scale, t);
        var pq = q[1];
        twoSum(pq, t[0], q);
        if(q[0]) {
          g[count++] = q[0];
        }
        var a = t[1];
        var b = q[1];
        var x = a + b;
        var bv = x - a;
        var y = b - bv;
        q[1] = x;
        if(y) {
          g[count++] = y;
        }
      }
      if(q[1]) {
        g[count++] = q[1];
      }
      if(count === 0) {
        g[count++] = 0.0;
      }
      g.length = count;
      return g
    }

    var robustDiff = robustSubtract;

    //Easy case: Add two scalars
    function scalarScalar(a, b) {
      var x = a + b;
      var bv = x - a;
      var av = x - bv;
      var br = b - bv;
      var ar = a - av;
      var y = ar + br;
      if(y) {
        return [y, x]
      }
      return [x]
    }

    function robustSubtract(e, f) {
      var ne = e.length|0;
      var nf = f.length|0;
      if(ne === 1 && nf === 1) {
        return scalarScalar(e[0], -f[0])
      }
      var n = ne + nf;
      var g = new Array(n);
      var count = 0;
      var eptr = 0;
      var fptr = 0;
      var abs = Math.abs;
      var ei = e[eptr];
      var ea = abs(ei);
      var fi = -f[fptr];
      var fa = abs(fi);
      var a, b;
      if(ea < fa) {
        b = ei;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
          ea = abs(ei);
        }
      } else {
        b = fi;
        fptr += 1;
        if(fptr < nf) {
          fi = -f[fptr];
          fa = abs(fi);
        }
      }
      if((eptr < ne && ea < fa) || (fptr >= nf)) {
        a = ei;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
          ea = abs(ei);
        }
      } else {
        a = fi;
        fptr += 1;
        if(fptr < nf) {
          fi = -f[fptr];
          fa = abs(fi);
        }
      }
      var x = a + b;
      var bv = x - a;
      var y = b - bv;
      var q0 = y;
      var q1 = x;
      var _x, _bv, _av, _br, _ar;
      while(eptr < ne && fptr < nf) {
        if(ea < fa) {
          a = ei;
          eptr += 1;
          if(eptr < ne) {
            ei = e[eptr];
            ea = abs(ei);
          }
        } else {
          a = fi;
          fptr += 1;
          if(fptr < nf) {
            fi = -f[fptr];
            fa = abs(fi);
          }
        }
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        }
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
      }
      while(eptr < ne) {
        a = ei;
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        }
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
        eptr += 1;
        if(eptr < ne) {
          ei = e[eptr];
        }
      }
      while(fptr < nf) {
        a = fi;
        b = q0;
        x = a + b;
        bv = x - a;
        y = b - bv;
        if(y) {
          g[count++] = y;
        } 
        _x = q1 + x;
        _bv = _x - q1;
        _av = _x - _bv;
        _br = x - _bv;
        _ar = q1 - _av;
        q0 = _ar + _br;
        q1 = _x;
        fptr += 1;
        if(fptr < nf) {
          fi = -f[fptr];
        }
      }
      if(q0) {
        g[count++] = q0;
      }
      if(q1) {
        g[count++] = q1;
      }
      if(!count) {
        g[count++] = 0.0;  
      }
      g.length = count;
      return g
    }

    var orientation_1 = createCommonjsModule(function (module) {






    var NUM_EXPAND = 5;

    var EPSILON     = 1.1102230246251565e-16;
    var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON;
    var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON;

    function cofactor(m, c) {
      var result = new Array(m.length-1);
      for(var i=1; i<m.length; ++i) {
        var r = result[i-1] = new Array(m.length-1);
        for(var j=0,k=0; j<m.length; ++j) {
          if(j === c) {
            continue
          }
          r[k++] = m[i][j];
        }
      }
      return result
    }

    function matrix(n) {
      var result = new Array(n);
      for(var i=0; i<n; ++i) {
        result[i] = new Array(n);
        for(var j=0; j<n; ++j) {
          result[i][j] = ["m", j, "[", (n-i-1), "]"].join("");
        }
      }
      return result
    }

    function sign(n) {
      if(n & 1) {
        return "-"
      }
      return ""
    }

    function generateSum(expr) {
      if(expr.length === 1) {
        return expr[0]
      } else if(expr.length === 2) {
        return ["sum(", expr[0], ",", expr[1], ")"].join("")
      } else {
        var m = expr.length>>1;
        return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
      }
    }

    function determinant(m) {
      if(m.length === 2) {
        return [["sum(prod(", m[0][0], ",", m[1][1], "),prod(-", m[0][1], ",", m[1][0], "))"].join("")]
      } else {
        var expr = [];
        for(var i=0; i<m.length; ++i) {
          expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""));
        }
        return expr
      }
    }

    function orientation(n) {
      var pos = [];
      var neg = [];
      var m = matrix(n);
      var args = [];
      for(var i=0; i<n; ++i) {
        if((i&1)===0) {
          pos.push.apply(pos, determinant(cofactor(m, i)));
        } else {
          neg.push.apply(neg, determinant(cofactor(m, i)));
        }
        args.push("m" + i);
      }
      var posExpr = generateSum(pos);
      var negExpr = generateSum(neg);
      var funcName = "orientation" + n + "Exact";
      var code = ["function ", funcName, "(", args.join(), "){var p=", posExpr, ",n=", negExpr, ",d=sub(p,n);\
return d[d.length-1];};return ", funcName].join("");
      var proc = new Function("sum", "prod", "scale", "sub", code);
      return proc(robustSum, twoProduct_1, robustScale, robustDiff)
    }

    var orientation3Exact = orientation(3);
    var orientation4Exact = orientation(4);

    var CACHED = [
      function orientation0() { return 0 },
      function orientation1() { return 0 },
      function orientation2(a, b) { 
        return b[0] - a[0]
      },
      function orientation3(a, b, c) {
        var l = (a[1] - c[1]) * (b[0] - c[0]);
        var r = (a[0] - c[0]) * (b[1] - c[1]);
        var det = l - r;
        var s;
        if(l > 0) {
          if(r <= 0) {
            return det
          } else {
            s = l + r;
          }
        } else if(l < 0) {
          if(r >= 0) {
            return det
          } else {
            s = -(l + r);
          }
        } else {
          return det
        }
        var tol = ERRBOUND3 * s;
        if(det >= tol || det <= -tol) {
          return det
        }
        return orientation3Exact(a, b, c)
      },
      function orientation4(a,b,c,d) {
        var adx = a[0] - d[0];
        var bdx = b[0] - d[0];
        var cdx = c[0] - d[0];
        var ady = a[1] - d[1];
        var bdy = b[1] - d[1];
        var cdy = c[1] - d[1];
        var adz = a[2] - d[2];
        var bdz = b[2] - d[2];
        var cdz = c[2] - d[2];
        var bdxcdy = bdx * cdy;
        var cdxbdy = cdx * bdy;
        var cdxady = cdx * ady;
        var adxcdy = adx * cdy;
        var adxbdy = adx * bdy;
        var bdxady = bdx * ady;
        var det = adz * (bdxcdy - cdxbdy) 
                + bdz * (cdxady - adxcdy)
                + cdz * (adxbdy - bdxady);
        var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
                      + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
                      + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
        var tol = ERRBOUND4 * permanent;
        if ((det > tol) || (-det > tol)) {
          return det
        }
        return orientation4Exact(a,b,c,d)
      }
    ];

    function slowOrient(args) {
      var proc = CACHED[args.length];
      if(!proc) {
        proc = CACHED[args.length] = orientation(args.length);
      }
      return proc.apply(undefined, args)
    }

    function generateOrientationProc() {
      while(CACHED.length <= NUM_EXPAND) {
        CACHED.push(orientation(CACHED.length));
      }
      var args = [];
      var procArgs = ["slow"];
      for(var i=0; i<=NUM_EXPAND; ++i) {
        args.push("a" + i);
        procArgs.push("o" + i);
      }
      var code = [
        "function getOrientation(", args.join(), "){switch(arguments.length){case 0:case 1:return 0;"
      ];
      for(var i=2; i<=NUM_EXPAND; ++i) {
        code.push("case ", i, ":return o", i, "(", args.slice(0, i).join(), ");");
      }
      code.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation");
      procArgs.push(code.join(""));

      var proc = Function.apply(undefined, procArgs);
      module.exports = proc.apply(undefined, [slowOrient].concat(CACHED));
      for(var i=0; i<=NUM_EXPAND; ++i) {
        module.exports[i] = CACHED[i];
      }
    }

    generateOrientationProc();
    });

    var robustPnp = robustPointInPolygon;



    function robustPointInPolygon(vs, point) {
      var x = point[0];
      var y = point[1];
      var n = vs.length;
      var inside = 1;
      var lim = n;
      for(var i = 0, j = n-1; i<lim; j=i++) {
        var a = vs[i];
        var b = vs[j];
        var yi = a[1];
        var yj = b[1];
        if(yj < yi) {
          if(yj < y && y < yi) {
            var s = orientation_1(a, b, point);
            if(s === 0) {
              return 0
            } else {
              inside ^= (0 < s)|0;
            }
          } else if(y === yi) {
            var c = vs[(i+1)%n];
            var yk = c[1];
            if(yi < yk) {
              var s = orientation_1(a, b, point);
              if(s === 0) {
                return 0
              } else {
                inside ^= (0 < s)|0;
              }
            }
          }
        } else if(yi < yj) {
          if(yi < y && y < yj) {
            var s = orientation_1(a, b, point);
            if(s === 0) {
              return 0
            } else {
              inside ^= (s < 0)|0;
            }
          } else if(y === yi) {
            var c = vs[(i+1)%n];
            var yk = c[1];
            if(yk < yi) {
              var s = orientation_1(a, b, point);
              if(s === 0) {
                return 0
              } else {
                inside ^= (s < 0)|0;
              }
            }
          }
        } else if(y === yi) {
          var x0 = Math.min(a[0], b[0]);
          var x1 = Math.max(a[0], b[0]);
          if(i === 0) {
            while(j>0) {
              var k = (j+n-1)%n;
              var p = vs[k];
              if(p[1] !== y) {
                break
              }
              var px = p[0];
              x0 = Math.min(x0, px);
              x1 = Math.max(x1, px);
              j = k;
            }
            if(j === 0) {
              if(x0 <= x && x <= x1) {
                return 0
              }
              return 1 
            }
            lim = j+1;
          }
          var y0 = vs[(j+n-1)%n][1];
          while(i+1<lim) {
            var p = vs[i+1];
            if(p[1] !== y) {
              break
            }
            var px = p[0];
            x0 = Math.min(x0, px);
            x1 = Math.max(x1, px);
            i += 1;
          }
          if(x0 <= x && x <= x1) {
            return 0
          }
          var y1 = vs[(i+1)%n][1];
          if(x < x0 && (y0 < y !== y1 < y)) {
            inside ^= 1;
          }
        }
      }
      return 2 * inside - 1
    }

    function pointInPolygon (point, geometry) {
      switch (geometry.type) {
        case 'Polygon': return pointInPolygon$1(point, geometry)
        case 'MultiPolygon': return pointInMultiPolygon(point, geometry)
      }
    }

    function pointInPolygon$1 (point, geometry) {
      const coordinates = geometry.coordinates;
      return pointInPolygonCoordinates(point, coordinates)
    }

    function pointInPolygonCoordinates (point, coordinates) {
      const outerRing = coordinates[0];

      if (!pointInRing(point, outerRing)) return false

      for (let i = 1; i < coordinates.length; i++) {
        const hole = coordinates[i];

        if (pointInRing(point, hole)) return false
      }

      return true
    }

    function pointInMultiPolygon (point, geometry) {
      const coordinates = geometry.coordinates;

      for (let i = 0; i < coordinates.length; i++) {
        const polygonCoordinates = coordinates[i];

        if (pointInPolygonCoordinates(point, polygonCoordinates)) return true
      }

      return false
    }

    function pointInRing (point, coordinates) {
      return robustPnp(coordinates, point) === -1
    }

    const invalidInputError = new Error('Invalid input');

    function getInput (geometry) {
      if ('coordinates' in geometry) {
        return 'geojson'
      }

      if ('x' in geometry && 'y' in geometry) {
        if (geometry.type !== 'Point') {
          ensureSameLength(geometry.x, geometry.y);
        }

        return 'xy'
      }

      throw invalidInputError
    }

    function ensureSameLength (x, y) {
      if (x !== undefined && y !== undefined) {
        if (x.constructor === Array && y.constructor === Array) {
          if (x.length === y.length && x.length > 1) {
            return
          }
        }
      }

      throw invalidInputError
    }

    function roundPoint ([x, y], decimals) {
      const zeroes = 10 ** decimals;

      return [
        Math.round(x * zeroes) / zeroes,
        Math.round(y * zeroes) / zeroes
      ]
    }

    function pointDistance$1 (p1, p2) {
      return Math.sqrt(
        (p1[0] - p2[0]) ** 2 +
        (p1[1] - p2[1]) ** 2
      )
    }

    function transformLinearRing (linearRing, transformation, settings) {
      if (!settings.simplify || linearRing.length < 3) {
        return transformLinearRingUnsimplified(linearRing, transformation)
      }

      if (settings.simplify === true) {
        return transformLinearRingSimplified(linearRing, transformation, settings.simplificationThreshold)
      }
    }

    function transformLinearRingUnsimplified (linearRing, transformation) {
      const transformedLinearRing = [];

      for (let i = 0; i < linearRing.length; i++) {
        transformedLinearRing.push(transformation(linearRing[i]));
      }

      return transformedLinearRing
    }

    function transformLinearRingSimplified (linearRing, transformation, simplificationThreshold = 1) {
      const transformedLinearRing = [transformation(linearRing[0])];

      let start = transformedLinearRing[0];
      let end;

      for (let i = 1; i < linearRing.length - 1; i++) {
        end = transformation(linearRing[i]);

        const dontSkip = pointDistance$1(start, end) >= simplificationThreshold;

        if (dontSkip) {
          transformedLinearRing.push(end);
          start = end;
        }
      }

      const lastPoint = transformation(linearRing[linearRing.length - 1]);
      transformedLinearRing.push(lastPoint);

      return transformedLinearRing
    }

    function transformSetOfLinearRings (linearRings, transformation, settings) {
      const transformedLinearRings = [];

      for (let i = 0; i < linearRings.length; i++) {
        transformedLinearRings.push(transformLinearRing(linearRings[i], transformation, settings));
      }

      return transformedLinearRings
    }

    function transformXYArrays ({ x, y }, transformation, settings) {
      if (!settings.simplify || x.length < 3) {
        return transformXYArraysUnsimplified(x, y, transformation)
      }

      if (settings.simplify === true) {
        return transformXYArraysSimplified(x, y, transformation, settings.simplificationThreshold)
      }
    }

    function transformXYArraysUnsimplified (x, y, transformation) {
      const transformedLinearRing = [];

      for (let i = 0; i < x.length; i++) {
        transformedLinearRing.push(transformation([x[i], y[i]]));
      }

      return transformedLinearRing
    }

    function transformXYArraysSimplified (x, y, transformation, simplificationThreshold = 1) {
      const transformedLinearRing = [transformation([x[0], y[0]])];

      let start = transformedLinearRing[0];
      let end;

      for (let i = 1; i < x.length - 1; i++) {
        end = transformation([x[i], y[i]]);

        const dontSkip = pointDistance$1(start, end) >= simplificationThreshold;

        if (dontSkip) {
          transformedLinearRing.push(end);
          start = end;
        }
      }

      const lastIndex = x.length - 1;
      const lastPoint = transformation([x[lastIndex], y[lastIndex]]);
      transformedLinearRing.push(lastPoint);

      return transformedLinearRing
    }

    const transformFunctions = {
      transformPoint,
      transformMultiPoint,
      transformLineString,
      transformMultiLineString,
      transformPolygon,
      transformMultiPolygon
    };

    function transformGeometry (geometry, _transformation, settings = {}) {
      const functionName = 'transform' + geometry.type;

      const transformation = settings.decimals
        ? point => roundPoint(_transformation(point), settings.decimals)
        : _transformation;

      return transformFunctions[functionName](geometry, transformation, settings)
    }

    function transformPoint (point, transformation) {
      const input = getInput(point);

      if (input === 'geojson') {
        return {
          type: 'Point',
          coordinates: transformation(point.coordinates)
        }
      }

      if (input === 'xy') {
        return {
          type: 'Point',
          coordinates: transformation([
            point.x,
            point.y
          ])
        }
      }
    }

    function transformMultiPoint (multiPoint, transformation) {
      const input = getInput(multiPoint);

      if (input === 'geojson') {
        return {
          type: 'MultiPoint',
          coordinates: transformLinearRing(multiPoint.coordinates, transformation, {})
        }
      }

      if (input === 'xy') {
        return {
          type: 'MultiPoint',
          coordinates: transformXYArrays(multiPoint, transformation, {})
        }
      }
    }

    function transformLineString (lineString, transformation, settings) {
      const input = getInput(lineString);

      if (input === 'geojson') {
        return {
          type: 'LineString',
          coordinates: transformLinearRing(lineString.coordinates, transformation, settings)
        }
      }

      if (input === 'xy') {
        return {
          type: 'LineString',
          coordinates: transformXYArrays(lineString, transformation, settings)
        }
      }
    }

    function transformMultiLineString (multiLineString, transformation, settings) {
      const input = getInput(multiLineString);

      if (input === 'geojson') {
        return {
          type: 'MultiLineString',
          coordinates: transformSetOfLinearRings(multiLineString.coordinates, transformation, settings)
        }
      }

      if (input === 'xy') {
        return {
          type: 'MultiLineString',
          coordinates: [
            transformXYArrays(multiLineString, transformation, settings)
          ]
        }
      }
    }

    function transformPolygon (polygon, transformation, settings) {
      const input = getInput(polygon);

      if (input === 'geojson') {
        return {
          type: 'Polygon',
          coordinates: transformSetOfLinearRings(polygon.coordinates, transformation, settings)
        }
      }

      if (input === 'xy') {
        return {
          type: 'Polygon',
          coordinates: [
            transformXYArrays(polygon, transformation, settings)
          ]
        }
      }
    }

    function transformMultiPolygon (multiPolygon, transformation, settings) {
      const input = getInput(multiPolygon);

      if (input === 'geojson') {
        const polygons = multiPolygon.coordinates;
        const transformedPolygons = [];

        for (let i = 0; i < polygons.length; i++) {
          transformedPolygons.push(transformSetOfLinearRings(polygons[i], transformation, settings));
        }

        return {
          type: 'MultiPolygon',
          coordinates: transformedPolygons
        }
      }

      if (input === 'xy') {
        return {
          type: 'MultiPolygon',
          coordinates: [
            [transformXYArrays(multiPolygon, transformation, settings)]
          ]
        }
      }
    }

    function getNumberOfInterpolatedPoints (
      from,
      to,
      toPolar,
      context,
      { interpolationThreshold = 1 }
    ) {
      const fromScaledDown = toPolar(from);
      const toScaledDown = toPolar(to);

      const totalScaleFactor = getTotalScaleFactor(context);

      if (straightInYDimension(fromScaledDown, toScaledDown, totalScaleFactor)) {
        return 0
      }

      const functionalForm = getFunctionalForm(fromScaledDown, toScaledDown);
      const scaledDownLength = getPolarLength(functionalForm);

      const realLength = scaledDownLength * totalScaleFactor;
      const numberOfPointsNeeded = realLength / interpolationThreshold;

      return Math.floor(numberOfPointsNeeded)
    }

    function getFunctionalForm (from, to) {
      const pointsSorted = from[0] < to[0]
        ? [from, to]
        : [to, from];

      const [[x1, y1], [x2, y2]] = pointsSorted;

      const a = (y2 - y1) / (x2 - x1);
      const b = y1 - (x1 * a);
      const interval = [x1, x2];

      return { a, b, interval }
    }

    function straightInYDimension (from, to, totalScaleFactor) {
      return Math.abs(from[0] - to[0]) * totalScaleFactor < 1
    }

    function getPolarLength ({ a, b, interval }) {
      const [c, d] = interval;

      if (a === 0) {
        return (d - c) * b
      }

      const aSq = a ** 2;
      const bSq = b ** 2;

      /*
       * This is the integral of:
       * sqrt( (a * theta + b) ** 2 + a ** 2 )
       * between c and d
       */
      return (
        aSq * Math.asinh((a * d + b) / a) + (a * d + b) *
        Math.sqrt(aSq * d ** 2 + 2 * a * b * d + bSq + aSq) -
        aSq * Math.asinh((a * c + b) / a) + (-a * c - b) *
        Math.sqrt(aSq * c ** 2 + 2 * a * b * c + bSq + aSq)
      ) / (2 * a)
    }

    function getTotalScaleFactor ({ finalRangeX, finalRangeY }) {
      const totalScaleFactorX = Math.abs(finalRangeX[0] - finalRangeX[1]) / 2;
      const totalScaleFactorY = Math.abs(finalRangeY[0] - finalRangeY[1]) / 2;

      return Math.max(totalScaleFactorX, totalScaleFactorY)
    }

    function interpolatePoints (
      transformedLinearRing,
      from,
      to,
      postScaleTransformation,
      numberOfPointsNeeded
    ) {
      const interpolator = interpolate$1(from, to);

      for (let i = 0; i < numberOfPointsNeeded; i++) {
        const t = (i + 1) / (numberOfPointsNeeded + 1);
        transformedLinearRing.push(
          postScaleTransformation(interpolator(t))
        );
      }
    }

    function interpolate$1 (a, b) {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];

      return t => ([
        a[0] + t * dx,
        a[1] + t * dy
      ])
    }

    function interpolateLinearRing (linearRing, context, transformations, settings) {
      if (!settings.simplify || linearRing.length < 3) {
        return interpolateLinearRingUnsimplified(linearRing, context, transformations, settings)
      }

      if (settings.simplify === true) {
        return interpolateLinearRingSimplified()
      }
    }

    function interpolateLinearRingUnsimplified (linearRing, context, transformations, settings) {
      const interpolatedLinearRing = [];
      const { scaleTransformation, postScaleTransformation, toPolar } = transformations;

      for (let i = 0; i < linearRing.length - 1; i++) {
        const from = linearRing[i];
        const to = linearRing[i + 1];
        const fromScaled = scaleTransformation(from);
        const toScaled = scaleTransformation(to);

        interpolatedLinearRing.push(postScaleTransformation(fromScaled));

        const numberOfPointsNeeded = getNumberOfInterpolatedPoints(
          fromScaled,
          toScaled,
          toPolar,
          context,
          settings
        );

        if (numberOfPointsNeeded > 0) {
          interpolatePoints(
            interpolatedLinearRing,
            fromScaled,
            toScaled,
            postScaleTransformation,
            numberOfPointsNeeded
          );
        }
      }

      const lastPoint = linearRing[linearRing.length - 1];
      interpolatedLinearRing.push(postScaleTransformation(
        scaleTransformation(lastPoint)
      ));

      return interpolatedLinearRing
    }

    function interpolateLinearRingSimplified (linearRing, context, transformations, settings) {

    }

    function interpolateSetOfLinearRings (linearRings, context, transformations, settings) {
      const interpolatedLinearRings = [];

      for (let i = 0; i < linearRings.length; i++) {
        interpolatedLinearRings.push(interpolateLinearRing(linearRings[i], context, transformations, settings));
      }

      return interpolatedLinearRings
    }

    function interpolateXYArrays ({ x, y }, context, transformations, settings) {
      if (!settings.simplify || x.length < 3) {
        return interpolateXYArraysUnsimplified(x, y, context, transformations, settings)
      }

      if (settings.simplify === true) {
        return interpolateXYArraysSimplified()
      }
    }

    function interpolateXYArraysUnsimplified (x, y, context, transformations, settings) {
      const interpolatedLinearRing = [];
      const { scaleTransformation, postScaleTransformation, toPolar } = transformations;

      for (let i = 0; i < x.length - 1; i++) {
        const from = [x[i], y[i]];
        const to = [x[i + 1], y[i + 1]];
        const fromScaled = scaleTransformation(from);
        const toScaled = scaleTransformation(to);

        interpolatedLinearRing.push(postScaleTransformation(fromScaled));

        const numberOfPointsNeeded = getNumberOfInterpolatedPoints(
          fromScaled,
          toScaled,
          toPolar,
          context,
          settings
        );

        if (numberOfPointsNeeded > 0) {
          interpolatePoints(
            interpolatedLinearRing,
            fromScaled,
            toScaled,
            postScaleTransformation,
            numberOfPointsNeeded
          );
        }
      }

      const lastIndex = x.length - 1;
      const lastPoint = [x[lastIndex], y[lastIndex]];
      interpolatedLinearRing.push(postScaleTransformation(
        scaleTransformation(lastPoint)
      ));

      return interpolatedLinearRing
    }

    function interpolateXYArraysSimplified (x, y, context, transformations, settings) {

    }

    const interpolateFunctions = {
      interpolateLineString,
      interpolateMultiLineString,
      interpolatePolygon,
      interpolateMultiPolygon
    };

    function polarGeometry (geometry, context, _transformations, settings = {}) {
      const functionName = 'interpolate' + geometry.type;

      const { scaleTransformation, postScaleTransformation: _postScaleTransformation } = _transformations;

      const postScaleTransformation = settings.decimals !== undefined
        ? point => roundPoint(_postScaleTransformation(point), settings.decimals)
        : _postScaleTransformation;

      const toTheta = linear$1().domain(context.rangeX).range([0, 2 * Math.PI]);
      const toRadius = linear$1().domain(context.rangeY).range([0, 1]);
      const toPolar = ([x, y]) => ([toTheta(x), toRadius(y)]);

      const transformations = { scaleTransformation, postScaleTransformation, toPolar };

      return interpolateFunctions[functionName](geometry, context, transformations, settings)
    }

    function interpolateLineString (lineString, context, transformations, settings) {
      const input = getInput(lineString);

      if (input === 'geojson') {
        return {
          type: 'LineString',
          coordinates: interpolateLinearRing(lineString.coordinates, context, transformations, settings)
        }
      }

      if (input === 'xy') {
        return {
          type: 'LineString',
          coordinates: interpolateXYArrays(lineString, context, transformations, settings)
        }
      }
    }

    function interpolateMultiLineString (multiLineString, context, transformations, settings) {
      const input = getInput(multiLineString);

      if (input === 'geojson') {
        return {
          type: 'MultiLineString',
          coordinates: interpolateSetOfLinearRings(multiLineString.coordinates, context, transformations, settings)
        }
      }

      if (input === 'xy') {
        return {
          type: 'MultiLineString',
          coordinates: [
            interpolateXYArrays(multiLineString, context, transformations, settings)
          ]
        }
      }
    }

    function interpolatePolygon (polygon, context, transformations, settings) {
      const input = getInput(polygon);

      if (input === 'geojson') {
        return {
          type: 'Polygon',
          coordinates: interpolateSetOfLinearRings(polygon.coordinates, context, transformations, settings)
        }
      }

      if (input === 'xy') {
        return {
          type: 'Polygon',
          coordinates: [
            interpolateXYArrays(polygon, context, transformations, settings)
          ]
        }
      }
    }

    function interpolateMultiPolygon (multiPolygon, context, transformations, settings) {
      const input = getInput(multiPolygon);

      if (input === 'geojson') {
        const polygons = multiPolygon.coordinates;
        const transformedPolygons = [];

        for (let i = 0; i < polygons.length; i++) {
          transformedPolygons.push(interpolateSetOfLinearRings(polygons[i], context, transformations, settings));
        }

        return {
          type: 'MultiPolygon',
          coordinates: transformedPolygons
        }
      }

      if (input === 'xy') {
        return {
          type: 'MultiPolygon',
          coordinates: [
            [interpolateXYArrays(multiPolygon, context, transformations, settings)]
          ]
        }
      }
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb$1(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb$1, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    function constant(x) {
      return function() {
        return x;
      };
    }

    function linear(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear(a, d) : constant(isNaN(a) ? b : a);
    }

    var rgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb(start, end) {
        var r = color((start = rgb$1(start)).r, (end = rgb$1(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb.gamma = rgbGamma;

      return rgb;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolate(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function number(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object$1(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolate(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function string(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: number(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolate(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? number
          : t === "string" ? ((c = color(b)) ? (b = c, rgb) : string)
          : b instanceof color ? rgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object$1
          : number)(a, b);
    }

    var earcut_1 = earcut;
    var _default = earcut;

    function earcut(data, holeIndices, dim) {

        dim = dim || 2;

        var hasHoles = holeIndices && holeIndices.length,
            outerLen = hasHoles ? holeIndices[0] * dim : data.length,
            outerNode = linkedList(data, 0, outerLen, dim, true),
            triangles = [];

        if (!outerNode || outerNode.next === outerNode.prev) return triangles;

        var minX, minY, maxX, maxY, x, y, invSize;

        if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

        // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
        if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];

            for (var i = dim; i < outerLen; i += dim) {
                x = data[i];
                y = data[i + 1];
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }

            // minX, minY and invSize are later used to transform coords into integers for z-order calculation
            invSize = Math.max(maxX - minX, maxY - minY);
            invSize = invSize !== 0 ? 1 / invSize : 0;
        }

        earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

        return triangles;
    }

    // create a circular doubly linked list from polygon points in the specified winding order
    function linkedList(data, start, end, dim, clockwise) {
        var i, last;

        if (clockwise === (signedArea(data, start, end, dim) > 0)) {
            for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
        } else {
            for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
        }

        if (last && equals(last, last.next)) {
            removeNode(last);
            last = last.next;
        }

        return last;
    }

    // eliminate colinear or duplicate points
    function filterPoints(start, end) {
        if (!start) return start;
        if (!end) end = start;

        var p = start,
            again;
        do {
            again = false;

            if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
                removeNode(p);
                p = end = p.prev;
                if (p === p.next) break;
                again = true;

            } else {
                p = p.next;
            }
        } while (again || p !== end);

        return end;
    }

    // main ear slicing loop which triangulates a polygon (given as a linked list)
    function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
        if (!ear) return;

        // interlink polygon nodes in z-order
        if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

        var stop = ear,
            prev, next;

        // iterate through ears, slicing them one by one
        while (ear.prev !== ear.next) {
            prev = ear.prev;
            next = ear.next;

            if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
                // cut off the triangle
                triangles.push(prev.i / dim);
                triangles.push(ear.i / dim);
                triangles.push(next.i / dim);

                removeNode(ear);

                // skipping the next vertex leads to less sliver triangles
                ear = next.next;
                stop = next.next;

                continue;
            }

            ear = next;

            // if we looped through the whole remaining polygon and can't find any more ears
            if (ear === stop) {
                // try filtering points and slicing again
                if (!pass) {
                    earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

                // if this didn't work, try curing all small self-intersections locally
                } else if (pass === 1) {
                    ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                    earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

                // as a last resort, try splitting the remaining polygon into two
                } else if (pass === 2) {
                    splitEarcut(ear, triangles, dim, minX, minY, invSize);
                }

                break;
            }
        }
    }

    // check whether a polygon node forms a valid ear with adjacent nodes
    function isEar(ear) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

        // now make sure we don't have other points inside the potential ear
        var p = ear.next.next;

        while (p !== ear.prev) {
            if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.next;
        }

        return true;
    }

    function isEarHashed(ear, minX, minY, invSize) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

        // triangle bbox; min & max are calculated like this for speed
        var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
            minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
            maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
            maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

        // z-order range for the current triangle bbox;
        var minZ = zOrder(minTX, minTY, minX, minY, invSize),
            maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

        var p = ear.prevZ,
            n = ear.nextZ;

        // look for points inside the triangle in both directions
        while (p && p.z >= minZ && n && n.z <= maxZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;

            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        // look for remaining points in decreasing z-order
        while (p && p.z >= minZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
        }

        // look for remaining points in increasing z-order
        while (n && n.z <= maxZ) {
            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        return true;
    }

    // go through all polygon nodes and cure small local self-intersections
    function cureLocalIntersections(start, triangles, dim) {
        var p = start;
        do {
            var a = p.prev,
                b = p.next.next;

            if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

                triangles.push(a.i / dim);
                triangles.push(p.i / dim);
                triangles.push(b.i / dim);

                // remove two nodes involved
                removeNode(p);
                removeNode(p.next);

                p = start = b;
            }
            p = p.next;
        } while (p !== start);

        return filterPoints(p);
    }

    // try splitting polygon into two and triangulate them independently
    function splitEarcut(start, triangles, dim, minX, minY, invSize) {
        // look for a valid diagonal that divides the polygon into two
        var a = start;
        do {
            var b = a.next.next;
            while (b !== a.prev) {
                if (a.i !== b.i && isValidDiagonal(a, b)) {
                    // split the polygon in two by the diagonal
                    var c = splitPolygon(a, b);

                    // filter colinear points around the cuts
                    a = filterPoints(a, a.next);
                    c = filterPoints(c, c.next);

                    // run earcut on each half
                    earcutLinked(a, triangles, dim, minX, minY, invSize);
                    earcutLinked(c, triangles, dim, minX, minY, invSize);
                    return;
                }
                b = b.next;
            }
            a = a.next;
        } while (a !== start);
    }

    // link every hole into the outer loop, producing a single-ring polygon without holes
    function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [],
            i, len, start, end, list;

        for (i = 0, len = holeIndices.length; i < len; i++) {
            start = holeIndices[i] * dim;
            end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            list = linkedList(data, start, end, dim, false);
            if (list === list.next) list.steiner = true;
            queue.push(getLeftmost(list));
        }

        queue.sort(compareX);

        // process holes from left to right
        for (i = 0; i < queue.length; i++) {
            eliminateHole(queue[i], outerNode);
            outerNode = filterPoints(outerNode, outerNode.next);
        }

        return outerNode;
    }

    function compareX(a, b) {
        return a.x - b.x;
    }

    // find a bridge between vertices that connects hole with an outer ring and and link it
    function eliminateHole(hole, outerNode) {
        outerNode = findHoleBridge(hole, outerNode);
        if (outerNode) {
            var b = splitPolygon(outerNode, hole);

            // filter collinear points around the cuts
            filterPoints(outerNode, outerNode.next);
            filterPoints(b, b.next);
        }
    }

    // David Eberly's algorithm for finding a bridge between hole and outer polygon
    function findHoleBridge(hole, outerNode) {
        var p = outerNode,
            hx = hole.x,
            hy = hole.y,
            qx = -Infinity,
            m;

        // find a segment intersected by a ray from the hole's leftmost point to the left;
        // segment's endpoint with lesser x will be potential connection point
        do {
            if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
                var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
                if (x <= hx && x > qx) {
                    qx = x;
                    if (x === hx) {
                        if (hy === p.y) return p;
                        if (hy === p.next.y) return p.next;
                    }
                    m = p.x < p.next.x ? p : p.next;
                }
            }
            p = p.next;
        } while (p !== outerNode);

        if (!m) return null;

        if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

        // look for points inside the triangle of hole point, segment intersection and endpoint;
        // if there are no points found, we have a valid connection;
        // otherwise choose the point of the minimum angle with the ray as connection point

        var stop = m,
            mx = m.x,
            my = m.y,
            tanMin = Infinity,
            tan;

        p = m;

        do {
            if (hx >= p.x && p.x >= mx && hx !== p.x &&
                    pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

                tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

                if (locallyInside(p, hole) &&
                    (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                    m = p;
                    tanMin = tan;
                }
            }

            p = p.next;
        } while (p !== stop);

        return m;
    }

    // whether sector in vertex m contains sector in vertex p in the same coordinates
    function sectorContainsSector(m, p) {
        return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
    }

    // interlink polygon nodes in z-order
    function indexCurve(start, minX, minY, invSize) {
        var p = start;
        do {
            if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
            p.prevZ = p.prev;
            p.nextZ = p.next;
            p = p.next;
        } while (p !== start);

        p.prevZ.nextZ = null;
        p.prevZ = null;

        sortLinked(p);
    }

    // Simon Tatham's linked list merge sort algorithm
    // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
    function sortLinked(list) {
        var i, p, q, e, tail, numMerges, pSize, qSize,
            inSize = 1;

        do {
            p = list;
            list = null;
            tail = null;
            numMerges = 0;

            while (p) {
                numMerges++;
                q = p;
                pSize = 0;
                for (i = 0; i < inSize; i++) {
                    pSize++;
                    q = q.nextZ;
                    if (!q) break;
                }
                qSize = inSize;

                while (pSize > 0 || (qSize > 0 && q)) {

                    if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                        e = p;
                        p = p.nextZ;
                        pSize--;
                    } else {
                        e = q;
                        q = q.nextZ;
                        qSize--;
                    }

                    if (tail) tail.nextZ = e;
                    else list = e;

                    e.prevZ = tail;
                    tail = e;
                }

                p = q;
            }

            tail.nextZ = null;
            inSize *= 2;

        } while (numMerges > 1);

        return list;
    }

    // z-order of a point given coords and inverse of the longer side of data bbox
    function zOrder(x, y, minX, minY, invSize) {
        // coords are transformed into non-negative 15-bit integer range
        x = 32767 * (x - minX) * invSize;
        y = 32767 * (y - minY) * invSize;

        x = (x | (x << 8)) & 0x00FF00FF;
        x = (x | (x << 4)) & 0x0F0F0F0F;
        x = (x | (x << 2)) & 0x33333333;
        x = (x | (x << 1)) & 0x55555555;

        y = (y | (y << 8)) & 0x00FF00FF;
        y = (y | (y << 4)) & 0x0F0F0F0F;
        y = (y | (y << 2)) & 0x33333333;
        y = (y | (y << 1)) & 0x55555555;

        return x | (y << 1);
    }

    // find the leftmost node of a polygon ring
    function getLeftmost(start) {
        var p = start,
            leftmost = start;
        do {
            if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
            p = p.next;
        } while (p !== start);

        return leftmost;
    }

    // check if a point lies within a convex triangle
    function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
               (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
               (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
    }

    // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
    function isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
               (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
                (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
                equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
    }

    // signed area of a triangle
    function area(p, q, r) {
        return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    }

    // check if two points are equal
    function equals(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }

    // check if two segments intersect
    function intersects(p1, q1, p2, q2) {
        var o1 = sign(area(p1, q1, p2));
        var o2 = sign(area(p1, q1, q2));
        var o3 = sign(area(p2, q2, p1));
        var o4 = sign(area(p2, q2, q1));

        if (o1 !== o2 && o3 !== o4) return true; // general case

        if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
        if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
        if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
        if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

        return false;
    }

    // for collinear points p, q, r, check if point q lies on segment pr
    function onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }

    function sign(num) {
        return num > 0 ? 1 : num < 0 ? -1 : 0;
    }

    // check if a polygon diagonal intersects any polygon segments
    function intersectsPolygon(a, b) {
        var p = a;
        do {
            if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                    intersects(p, p.next, a, b)) return true;
            p = p.next;
        } while (p !== a);

        return false;
    }

    // check if a polygon diagonal is locally inside the polygon
    function locallyInside(a, b) {
        return area(a.prev, a, a.next) < 0 ?
            area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
            area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
    }

    // check if the middle point of a polygon diagonal is inside the polygon
    function middleInside(a, b) {
        var p = a,
            inside = false,
            px = (a.x + b.x) / 2,
            py = (a.y + b.y) / 2;
        do {
            if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                    (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
                inside = !inside;
            p = p.next;
        } while (p !== a);

        return inside;
    }

    // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
    // if one belongs to the outer ring and another to a hole, it merges it into a single ring
    function splitPolygon(a, b) {
        var a2 = new Node(a.i, a.x, a.y),
            b2 = new Node(b.i, b.x, b.y),
            an = a.next,
            bp = b.prev;

        a.next = b;
        b.prev = a;

        a2.next = an;
        an.prev = a2;

        b2.next = a2;
        a2.prev = b2;

        bp.next = b2;
        b2.prev = bp;

        return b2;
    }

    // create a node and optionally link it with previous one (in a circular doubly linked list)
    function insertNode(i, x, y, last) {
        var p = new Node(i, x, y);

        if (!last) {
            p.prev = p;
            p.next = p;

        } else {
            p.next = last.next;
            p.prev = last;
            last.next.prev = p;
            last.next = p;
        }
        return p;
    }

    function removeNode(p) {
        p.next.prev = p.prev;
        p.prev.next = p.next;

        if (p.prevZ) p.prevZ.nextZ = p.nextZ;
        if (p.nextZ) p.nextZ.prevZ = p.prevZ;
    }

    function Node(i, x, y) {
        // vertex index in coordinates array
        this.i = i;

        // vertex coordinates
        this.x = x;
        this.y = y;

        // previous and next vertex nodes in a polygon ring
        this.prev = null;
        this.next = null;

        // z-order curve value
        this.z = null;

        // previous and next nodes in z-order
        this.prevZ = null;
        this.nextZ = null;

        // indicates whether this is a steiner point
        this.steiner = false;
    }

    // return a percentage difference between the polygon area and its triangulation area;
    // used to verify correctness of triangulation
    earcut.deviation = function (data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
            for (var i = 0, len = holeIndices.length; i < len; i++) {
                var start = holeIndices[i] * dim;
                var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
                polygonArea -= Math.abs(signedArea(data, start, end, dim));
            }
        }

        var trianglesArea = 0;
        for (i = 0; i < triangles.length; i += 3) {
            var a = triangles[i] * dim;
            var b = triangles[i + 1] * dim;
            var c = triangles[i + 2] * dim;
            trianglesArea += Math.abs(
                (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
                (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
        }

        return polygonArea === 0 && trianglesArea === 0 ? 0 :
            Math.abs((trianglesArea - polygonArea) / polygonArea);
    };

    function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i = start, j = end - dim; i < end; i += dim) {
            sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
            j = i;
        }
        return sum;
    }

    // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
    earcut.flatten = function (data) {
        var dim = data[0][0].length,
            result = {vertices: [], holes: [], dimensions: dim},
            holeIndex = 0;

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
            }
            if (i > 0) {
                holeIndex += data[i - 1].length;
                result.holes.push(holeIndex);
            }
        }
        return result;
    };
    earcut_1.default = _default;

    function identity(x) {
      return x;
    }

    function transform(transform) {
      if (transform == null) return identity;
      var x0,
          y0,
          kx = transform.scale[0],
          ky = transform.scale[1],
          dx = transform.translate[0],
          dy = transform.translate[1];
      return function(input, i) {
        if (!i) x0 = y0 = 0;
        var j = 2, n = input.length, output = new Array(n);
        output[0] = (x0 += input[0]) * kx + dx;
        output[1] = (y0 += input[1]) * ky + dy;
        while (j < n) output[j] = input[j], ++j;
        return output;
      };
    }

    function reverse(array, n) {
      var t, j = array.length, i = j - n;
      while (i < --j) t = array[i], array[i++] = array[j], array[j] = t;
    }

    function feature(topology, o) {
      if (typeof o === "string") o = topology.objects[o];
      return o.type === "GeometryCollection"
          ? {type: "FeatureCollection", features: o.geometries.map(function(o) { return feature$1(topology, o); })}
          : feature$1(topology, o);
    }

    function feature$1(topology, o) {
      var id = o.id,
          bbox = o.bbox,
          properties = o.properties == null ? {} : o.properties,
          geometry = object(topology, o);
      return id == null && bbox == null ? {type: "Feature", properties: properties, geometry: geometry}
          : bbox == null ? {type: "Feature", id: id, properties: properties, geometry: geometry}
          : {type: "Feature", id: id, bbox: bbox, properties: properties, geometry: geometry};
    }

    function object(topology, o) {
      var transformPoint = transform(topology.transform),
          arcs = topology.arcs;

      function arc(i, points) {
        if (points.length) points.pop();
        for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) {
          points.push(transformPoint(a[k], k));
        }
        if (i < 0) reverse(points, n);
      }

      function point(p) {
        return transformPoint(p);
      }

      function line(arcs) {
        var points = [];
        for (var i = 0, n = arcs.length; i < n; ++i) arc(arcs[i], points);
        if (points.length < 2) points.push(points[0]); // This should never happen per the specification.
        return points;
      }

      function ring(arcs) {
        var points = line(arcs);
        while (points.length < 4) points.push(points[0]); // This may happen if an arc has only two points.
        return points;
      }

      function polygon(arcs) {
        return arcs.map(ring);
      }

      function geometry(o) {
        var type = o.type, coordinates;
        switch (type) {
          case "GeometryCollection": return {type: type, geometries: o.geometries.map(geometry)};
          case "Point": coordinates = point(o.coordinates); break;
          case "MultiPoint": coordinates = o.coordinates.map(point); break;
          case "LineString": coordinates = line(o.arcs); break;
          case "MultiLineString": coordinates = o.arcs.map(line); break;
          case "Polygon": coordinates = polygon(o.arcs); break;
          case "MultiPolygon": coordinates = o.arcs.map(polygon); break;
          default: return null;
        }
        return {type: type, coordinates: coordinates};
      }

      return geometry(o);
    }

    function stitch(topology, arcs) {
      var stitchedArcs = {},
          fragmentByStart = {},
          fragmentByEnd = {},
          fragments = [],
          emptyIndex = -1;

      // Stitch empty arcs first, since they may be subsumed by other arcs.
      arcs.forEach(function(i, j) {
        var arc = topology.arcs[i < 0 ? ~i : i], t;
        if (arc.length < 3 && !arc[1][0] && !arc[1][1]) {
          t = arcs[++emptyIndex], arcs[emptyIndex] = i, arcs[j] = t;
        }
      });

      arcs.forEach(function(i) {
        var e = ends(i),
            start = e[0],
            end = e[1],
            f, g;

        if (f = fragmentByEnd[start]) {
          delete fragmentByEnd[f.end];
          f.push(i);
          f.end = end;
          if (g = fragmentByStart[end]) {
            delete fragmentByStart[g.start];
            var fg = g === f ? f : f.concat(g);
            fragmentByStart[fg.start = f.start] = fragmentByEnd[fg.end = g.end] = fg;
          } else {
            fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
          }
        } else if (f = fragmentByStart[end]) {
          delete fragmentByStart[f.start];
          f.unshift(i);
          f.start = start;
          if (g = fragmentByEnd[start]) {
            delete fragmentByEnd[g.end];
            var gf = g === f ? f : g.concat(f);
            fragmentByStart[gf.start = g.start] = fragmentByEnd[gf.end = f.end] = gf;
          } else {
            fragmentByStart[f.start] = fragmentByEnd[f.end] = f;
          }
        } else {
          f = [i];
          fragmentByStart[f.start = start] = fragmentByEnd[f.end = end] = f;
        }
      });

      function ends(i) {
        var arc = topology.arcs[i < 0 ? ~i : i], p0 = arc[0], p1;
        if (topology.transform) p1 = [0, 0], arc.forEach(function(dp) { p1[0] += dp[0], p1[1] += dp[1]; });
        else p1 = arc[arc.length - 1];
        return i < 0 ? [p1, p0] : [p0, p1];
      }

      function flush(fragmentByEnd, fragmentByStart) {
        for (var k in fragmentByEnd) {
          var f = fragmentByEnd[k];
          delete fragmentByStart[f.start];
          delete f.start;
          delete f.end;
          f.forEach(function(i) { stitchedArcs[i < 0 ? ~i : i] = 1; });
          fragments.push(f);
        }
      }

      flush(fragmentByEnd, fragmentByStart);
      flush(fragmentByStart, fragmentByEnd);
      arcs.forEach(function(i) { if (!stitchedArcs[i < 0 ? ~i : i]) fragments.push([i]); });

      return fragments;
    }

    function planarRingArea(ring) {
      var i = -1, n = ring.length, a, b = ring[n - 1], area = 0;
      while (++i < n) a = b, b = ring[i], area += a[0] * b[1] - a[1] * b[0];
      return Math.abs(area); // Note: doubled area!
    }

    function mergeArcs(topology, objects) {
      var polygonsByArc = {},
          polygons = [],
          groups = [];

      objects.forEach(geometry);

      function geometry(o) {
        switch (o.type) {
          case "GeometryCollection": o.geometries.forEach(geometry); break;
          case "Polygon": extract(o.arcs); break;
          case "MultiPolygon": o.arcs.forEach(extract); break;
        }
      }

      function extract(polygon) {
        polygon.forEach(function(ring) {
          ring.forEach(function(arc) {
            (polygonsByArc[arc = arc < 0 ? ~arc : arc] || (polygonsByArc[arc] = [])).push(polygon);
          });
        });
        polygons.push(polygon);
      }

      function area(ring) {
        return planarRingArea(object(topology, {type: "Polygon", arcs: [ring]}).coordinates[0]);
      }

      polygons.forEach(function(polygon) {
        if (!polygon._) {
          var group = [],
              neighbors = [polygon];
          polygon._ = 1;
          groups.push(group);
          while (polygon = neighbors.pop()) {
            group.push(polygon);
            polygon.forEach(function(ring) {
              ring.forEach(function(arc) {
                polygonsByArc[arc < 0 ? ~arc : arc].forEach(function(polygon) {
                  if (!polygon._) {
                    polygon._ = 1;
                    neighbors.push(polygon);
                  }
                });
              });
            });
          }
        }
      });

      polygons.forEach(function(polygon) {
        delete polygon._;
      });

      return {
        type: "MultiPolygon",
        arcs: groups.map(function(polygons) {
          var arcs = [], n;

          // Extract the exterior (unique) arcs.
          polygons.forEach(function(polygon) {
            polygon.forEach(function(ring) {
              ring.forEach(function(arc) {
                if (polygonsByArc[arc < 0 ? ~arc : arc].length < 2) {
                  arcs.push(arc);
                }
              });
            });
          });

          // Stitch the arcs into one or more rings.
          arcs = stitch(topology, arcs);

          // If more than one ring is returned,
          // at most one of these rings can be the exterior;
          // choose the one with the greatest absolute area.
          if ((n = arcs.length) > 1) {
            for (var i = 1, k = area(arcs[0]), ki, t; i < n; ++i) {
              if ((ki = area(arcs[i])) > k) {
                t = arcs[0], arcs[0] = arcs[i], arcs[i] = t, k = ki;
              }
            }
          }

          return arcs;
        }).filter(function(arcs) {
          return arcs.length > 0;
        })
      };
    }

    function pointDistance (point1, point2) {
      return Math.sqrt(
        (point1[0] - point2[0]) ** 2 +
        (point1[1] - point2[1]) ** 2
      )
    }

    function linearRingLength (linearRing) {
      let totalLength = 0;

      for (let i = 0; i < linearRing.length - 1; i++) {
        const from = linearRing[i];
        const to = linearRing[i + 1];

        totalLength += pointDistance(from, to);
      }

      return totalLength
    }

    /*
      Why this weird map function when there is Array.map?
      Well, usually premature optimization is the root of all evil,
      but Array.map is just really really slow.

      See, for example,  https://jsperf.com/map-reduce-named-functions/2
      Array.map is more than 6x slower than a classical for loop,
      and almost 4x slower than a custom implementation like this one.
    */
    function map (array, callback) {
      const result = [];

      for (let i = 0; i < array.length; i++) {
        result.push(callback(array[i], i));
      }

      return result
    }

    function getOrderDescending (array) {
      const indexArray = map(array, (_, i) => i);
      indexArray.sort((a, b) => array[b] - array[a]);

      return indexArray
    }

    function sortIntoOrder (array, order) {
      return map(order, i => array[i])
    }

    function getInsertionIndexDescending (arraySortedDescending, value) {
      if (arraySortedDescending.length === 0) return 0

      for (let i = arraySortedDescending.length - 1; i >= 0; i--) {
        const arrayValue = arraySortedDescending[i];

        if (value <= arrayValue) return i
      }

      return 0
    }

    function removeClosingPoint (linearRing) {
      linearRing.pop();

      return linearRing
    }

    function closeRing (linearRing) {
      let firstPoint = linearRing[0];
      linearRing.push(firstPoint);

      return linearRing
    }

    function insertPointsLinearRing (inputLinearRing, numberOfAdditionalPoints) {
      let linearRing = cloneLinearRing(inputLinearRing);
      linearRing = removeClosingPoint(linearRing);
      linearRing = insertPoints(linearRing, numberOfAdditionalPoints, { ring: true });
      linearRing = closeRing(linearRing);

      return linearRing
    }

    function insertPointsLineString (inputLineString, numberOfAdditionalPoints) {
      const lineString = cloneLinearRing(inputLineString);
      return insertPoints(lineString, numberOfAdditionalPoints, { ring: false })
    }

    function insertPoints (lineString, numberOfAdditionalPoints, { ring }) {
      const edgeLengths = getEdgeLengths(lineString, ring);
      let orderedEdgeIds = getOrderDescending(edgeLengths);

      for (let i = 0; i < numberOfAdditionalPoints; i++) {
        const longestEdgeId = orderedEdgeIds[0];

        const edge = getEdge(lineString, longestEdgeId);

        const edgeLength = edgeLengths[longestEdgeId];

        const newEdges = splitEdge(edge);
        const newEdgesLength = edgeLength / 2;

        // Remove old edge
        orderedEdgeIds.shift();
        lineString[longestEdgeId] = null;
        edgeLengths[longestEdgeId] = null;

        // Insert new edges
        orderedEdgeIds = insertOrderedId(orderedEdgeIds, edgeLengths, longestEdgeId, newEdgesLength);

        lineString[longestEdgeId] = newEdges[0][0];
        lineString.splice(longestEdgeId + 1, 0, newEdges[1][0]);

        edgeLengths[longestEdgeId] = newEdgesLength;
        edgeLengths.splice(longestEdgeId + 1, 0, newEdgesLength);
      }

      return lineString
    }

    function cloneLinearRing (linearRing) {
      const clonedLinearRing = [];

      for (let i = 0; i < linearRing.length; i++) {
        clonedLinearRing.push(linearRing[i].slice(0));
      }

      return clonedLinearRing
    }

    function getEdgeLengths (linearRing, ring) {
      const edgeLengths = [];
      const edges = ring ? linearRing.length : linearRing.length - 1;

      for (let i = 0; i < edges; i++) {
        const edge = getEdge(linearRing, i);

        edgeLengths.push(pointDistance(edge[0], edge[1]));
      }

      return edgeLengths
    }

    function getEdge (linearRing, index) {
      return [
        linearRing[index], linearRing[(index + 1) % linearRing.length]
      ]
    }

    function splitEdge (edge) {
      const pointInBetween = interpolate(edge[0], edge[1])(0.5);

      return [
        [edge[0], pointInBetween],
        [pointInBetween, edge[1]]
      ]
    }

    function insertOrderedId (orderedIds, edgeLengths, valueIndex, newValue) {
      // Insert new Ids right place
      let idsWereInserted = false;

      for (let i = 0; i < orderedIds.length; i++) {
        const index = orderedIds[i];

        // Increase all indices after the valueIndex with 1
        if (index > valueIndex) orderedIds[i] = orderedIds[i] + 1;

        const currentArrayValue = edgeLengths[index];
        if (currentArrayValue === null) continue

        if (newValue >= currentArrayValue) {
          orderedIds.splice(i, 0, valueIndex);
          orderedIds.splice(i + 1, 0, valueIndex + 1);

          idsWereInserted = true;
          break
        }
      }

      if (!idsWereInserted) {
        orderedIds.push(valueIndex);
        orderedIds.push(valueIndex + 1);
      }

      return orderedIds
    }

    /*
      Taken from flubber:
      https://github.com/veltman/flubber
    */

    function rotatePointsLinearRing (inputLinearRing, toLinearRing) {
      let fromLinearRing = cloneLinearRing(inputLinearRing);
      fromLinearRing = removeClosingPoint(fromLinearRing);

      const fromLength = fromLinearRing.length;
      let min = Infinity;
      let bestOffset;
      let sumOfSquares;
      let spliced;

      for (let offset = 0; offset < fromLength; offset++) {
        sumOfSquares = 0;

        toLinearRing.forEach((point, i) => {
          const distance = pointDistance(fromLinearRing[(offset + i) % fromLength], point);
          sumOfSquares += distance * distance;
        });

        if (sumOfSquares < min) {
          min = sumOfSquares;
          bestOffset = offset;
        }
      }

      if (bestOffset) {
        spliced = fromLinearRing.splice(0, bestOffset);
        fromLinearRing.splice(fromLinearRing.length, 0, ...spliced);
      }

      fromLinearRing = closeRing(fromLinearRing);

      return fromLinearRing
    }

    function isLinearRing (ring) {
      return ring.constructor === Array
    }

    function isPolygon (geometry) {
      return geometry.constructor === Object && geometry.type === 'Polygon'
    }

    function isMultiPolygon (geometry) {
      return geometry.constructor === Object && geometry.type === 'MultiPolygon'
    }

    function isPolygonOrMultiPolygon (geometry) {
      return isPolygon(geometry) || isMultiPolygon(geometry)
    }

    function isLineString (geometry) {
      return geometry.constructor === Object && geometry.type === 'LineString'
    }

    function isMultiLineString (geometry) {
      return geometry.constructor === Object && geometry.type === 'MultiLineString'
    }

    function isLineStringOrMultiLineString (geometry) {
      return isLineString(geometry) || isMultiLineString(geometry)
    }

    function polygonArea (polygon) {
      if (isLinearRing(polygon)) {
        return getRingArea(polygon)
      }

      if (isPolygon(polygon)) {
        return getPolygonArea(polygon)
      }

      if (isMultiPolygon(polygon)) {
        return getMultiPolygonArea(polygon)
      }

      throw new Error('Invalid input')
    }

    function linearRingIsClockwise (ring) {
      return getSignedRingArea(ring) < 0
    }

    function getRingArea (ring) {
      return Math.abs(getSignedRingArea(ring))
    }

    // Taken from: https://stackoverflow.com/a/33670691/7237112
    function getSignedRingArea (ring) {
      let total = 0;

      for (let i = 0, l = ring.length; i < l; i++) {
        const addX = ring[i][0];
        const addY = ring[i === ring.length - 1 ? 0 : i + 1][1];
        const subX = ring[i === ring.length - 1 ? 0 : i + 1][0];
        const subY = ring[i][1];

        total += (addX * addY * 0.5);
        total -= (subX * subY * 0.5);
      }

      return total
    }

    function getPolygonArea (polygon) {
      let totalArea = getRingArea(polygon.coordinates[0]);

      for (let i = 1; i < polygon.coordinates.length; i++) {
        const holeArea = getRingArea(polygon.coordinates[i]);
        totalArea -= holeArea;
      }

      return totalArea
    }

    function getMultiPolygonArea (multiPolygon) {
      let totalArea = 0;

      for (let i = 0; i < multiPolygon.coordinates.length; i++) {
        totalArea += getPolygonArea(multiPolygon.coordinates[i]);
      }

      return totalArea
    }

    function matchLinearRings (fromRings, toRings) {
      if (tooManyRings(fromRings)) {
        return map(fromRings, (_, i) => i)
      }

      return bestOrder(fromRings, toRings)
    }

    function tooManyRings (rings) {
      // with more than 9 rings, everything will be too chaotic to notice this stuff anyway.
      return rings.length > 9
    }

    function bestOrder (fromRings, toRings) {
      const fromAreas = map(fromRings, polygonArea);
      const toAreas = map(toRings, polygonArea);

      const fromAreasOrderDescending = getOrderDescending(fromAreas);
      const toAreasOrderDescending = getOrderDescending(toAreas);

      const pairs = {};

      for (let i = 0; i < toAreasOrderDescending.length; i++) {
        const fromIndex = fromAreasOrderDescending[i];
        const toIndex = toAreasOrderDescending[i];

        pairs[toIndex] = fromIndex;
      }

      const fromOrder = [];

      for (let i = 0; i < toRings.length; i++) {
        fromOrder.push(pairs[i]);
      }

      return fromOrder
    }

    function calculateCentroid (geometry) {
      if (isLinearRing(geometry)) {
        return calculateLinearRingCentroid(geometry)
      }

      if (isPolygon(geometry)) {
        return calculatePolygonCentroid(geometry)
      }

      if (isMultiPolygon(geometry)) {
        return calculateMultiPolygonCentroid(geometry)
      }
    }

    // https://stackoverflow.com/a/33852627/7237112
    function calculateLinearRingCentroid (ring) {
      const nPts = ring.length;
      const off = ring[0];
      let twicearea = 0;
      let x = 0;
      let y = 0;
      let p1;
      let p2;
      let f;

      for (let i = 0, j = nPts - 1; i < nPts; j = i++) {
        p1 = ring[i];
        p2 = ring[j];
        f = (p1[0] - off[0]) * (p2[1] - off[1]) - (p2[0] - off[0]) * (p1[1] - off[1]);
        twicearea += f;
        x += (p1[0] + p2[0] - 2 * off[0]) * f;
        y += (p1[1] + p2[1] - 2 * off[1]) * f;
      }

      f = twicearea * 3;

      return [x / f + off[0], y / f + off[1]]
    }

    function calculatePolygonCentroid (polygon) {
      // We will ignore holes and just take the outer ring
      return calculateLinearRingCentroid(polygon.coordinates[0])
    }

    function calculateMultiPolygonCentroid (multiPolygon) {
      // We will take the centroid of each polygon (ignoring holes)
      // and take the weighted (by area) center of these.
      let x = 0;
      let y = 0;
      let totalArea = 0;

      for (let i = 0; i < multiPolygon.coordinates.length; i++) {
        const polygon = multiPolygon.coordinates[i];
        const polygonCentroid = calculateLinearRingCentroid(polygon[0]);
        const area = polygonArea(polygon[0]);

        x += polygonCentroid[0] * area;
        y += polygonCentroid[1] * area;
        totalArea += area;
      }

      return [x / totalArea, y / totalArea]
    }

    function polygonToPolygon (from, to) {
      const fromOuterRing = from.coordinates[0];
      const toOuterRing = to.coordinates[0];

      const [fromOuterRingPrepared, toOuterRingPrepared] = prepareLinearRings(fromOuterRing, toOuterRing);

      if (neitherHasHoles(from, to)) {
        return createInterpolatorNoHoles(from, to, fromOuterRingPrepared, toOuterRingPrepared)
      }

      const holeInterpolators = createHoleInterpolators(from, to);

      return createInterpolatorWithHoles(
        from, to, fromOuterRingPrepared, toOuterRingPrepared, holeInterpolators
      )
    }

    function prepareLinearRings (fromRing, toRing) {
      const lengthDifference = fromRing.length - toRing.length;

      if (lengthDifference > 0) {
        toRing = insertPointsLinearRing(toRing, lengthDifference);
      }

      if (lengthDifference < 0) {
        fromRing = insertPointsLinearRing(fromRing, -lengthDifference);
      }

      const rotatedFromRing = rotatePointsLinearRing(fromRing, toRing);

      return [rotatedFromRing, toRing]
    }

    function createInterpolatorNoHoles (from, to, fromOuterRingPrepared, toOuterRingPrepared) {
      const outerRingInterpolator = interpolate(fromOuterRingPrepared, toOuterRingPrepared);

      return function interpolator (t) {
        if (t === 0) return from
        if (t === 1) return to

        const interpolatedLinearRing = outerRingInterpolator(t);

        return {
          type: 'Polygon',
          coordinates: [interpolatedLinearRing]
        }
      }
    }

    function neitherHasHoles (from, to) {
      return from.coordinates.length === 1 && to.coordinates.length === 1
    }

    function getHoles (polygon, numberOfHoles) {
      const holes = [];

      for (let i = 1; i <= numberOfHoles; i++) {
        holes.push(polygon.coordinates[i]);
      }

      return holes
    }

    function createHoleInterpolators (from, to) {
      let holeInterpolators = [];

      const numberOfMatchableHoles = Math.min(from.coordinates.length, to.coordinates.length) - 1;

      if (numberOfMatchableHoles > 0) {
        holeInterpolators = holeInterpolators.concat(
          createMatchableHoleInterpolators(from, to, numberOfMatchableHoles)
        );
      }

      const differenceBetweenNumberOfHoles = from.coordinates.length - to.coordinates.length;

      if (differenceBetweenNumberOfHoles > 0) {
        holeInterpolators = holeInterpolators.concat(
          createHoleImploders(from, differenceBetweenNumberOfHoles)
        );
      }

      if (differenceBetweenNumberOfHoles < 0) {
        holeInterpolators = holeInterpolators.concat(
          createHoleExploders(to, -differenceBetweenNumberOfHoles)
        );
      }

      return holeInterpolators
    }

    function createMatchableHoleInterpolators (from, to, numberOfMatchableHoles) {
      const holeInterpolators = [];

      const fromHoles = getHoles(from, numberOfMatchableHoles);
      const toHoles = getHoles(to, numberOfMatchableHoles);

      const fromOrder = matchLinearRings(fromHoles, toHoles);
      const fromHolesSorted = map(fromOrder, i => fromHoles[i]);

      for (let i = 0; i < numberOfMatchableHoles; i++) {
        const fromHole = fromHolesSorted[i];
        const toHole = toHoles[i];

        const [fromHolePrepared, toHolePrepared] = prepareLinearRings(fromHole, toHole);

        const holeInterpolator = interpolate(fromHolePrepared, toHolePrepared);

        holeInterpolators.push(holeInterpolator);
      }

      return holeInterpolators
    }

    function createHoleImploders (polygon, differenceBetweenNumberOfHoles) {
      const interpolators = [];

      const firstHoleThatNeedsImplodingIndex = polygon.coordinates.length - differenceBetweenNumberOfHoles;

      for (let i = firstHoleThatNeedsImplodingIndex; i < polygon.coordinates.length; i++) {
        const hole = polygon.coordinates[i];
        const holeCentroid = calculateCentroid(hole);
        const smallRectangleAroundCentroid = makeSmallRectangleAroundPoint(holeCentroid);

        const [preparedPolygon, preparedImplodePoint] = prepareLinearRings(hole, smallRectangleAroundCentroid);

        interpolators.push(interpolate(preparedPolygon, preparedImplodePoint));
      }

      return interpolators
    }

    function createHoleExploders (polygon, differenceBetweenNumberOfHoles) {
      return map(createHoleImploders(polygon, differenceBetweenNumberOfHoles), holeInterpolator => {
        return t => holeInterpolator(1 - t)
      })
    }

    function makeSmallRectangleAroundPoint ([x, y]) {
      const epsilon = 1e-6;

      const x1 = x - epsilon;
      const x2 = x + epsilon;
      const y1 = y - epsilon;
      const y2 = y + epsilon;

      return [[x1, y1], [x1, y2], [x2, y2], [x2, y1], [x1, y1]]
    }

    function createInterpolatorWithHoles (
      from, to, fromOuterRingPrepared, toOuterRingPrepared, holeInterpolators
    ) {
      const outerRingInterpolator = interpolate(fromOuterRingPrepared, toOuterRingPrepared);

      return function interpolator (t) {
        if (t === 0) return from
        if (t === 1) return to

        const interpolatedLinearRing = outerRingInterpolator(t);

        return {
          type: 'Polygon',
          coordinates: [
            interpolatedLinearRing,
            ...map(holeInterpolators, holeInterpolator => holeInterpolator(t))
          ]
        }
      }
    }

    /*
      Taken from flubber:
      https://github.com/veltman/flubber
    */

    function createTopology (vertices, triangleIndices) {
      const arcIndices = {};
      const topology = createEmptyTopology();

      for (let i = 0; i < triangleIndices.length; i += 3) {
        const geometry = [];

        const triangleIndexArcs = createTriangleIndexArcs(triangleIndices, i);

        triangleIndexArcs.forEach(arc => {
          const slug = createArcSlug(arc);

          const coordinates = map(arc, pointIndex => getPoint(vertices, pointIndex));

          if (slug in arcIndices) {
            geometry.push(~arcIndices[slug]); // Not sure what this is doing
          } else {
            geometry.push((arcIndices[slug] = topology.arcs.length));
            topology.arcs.push(coordinates);
          }
        });

        const area = getTriangleArea(vertices, triangleIndexArcs);
        const polygon = createTopoPolygon(area, geometry);

        topology.objects.triangles.geometries.push(polygon);
      }

      // Sort smallest first
      // TODO sorted insertion?
      topology.objects.triangles.geometries.sort((a, b) => a.area - b.area);

      return topology
    }

    function createEmptyTopology () {
      return {
        type: 'Topology',
        objects: {
          triangles: {
            type: 'GeometryCollection',
            geometries: []
          }
        },
        arcs: []
      }
    }

    function createTriangleIndexArcs (triangleIndices, i) {
      const a = triangleIndices[i];
      const b = triangleIndices[i + 1];
      const c = triangleIndices[i + 2];

      return [[a, b], [b, c], [c, a]]
    }

    function createArcSlug (arc) {
      return arc[0] < arc[1] ? arc.join(',') : arc[1] + ',' + arc[0]
    }

    function getPoint (vertices, i) {
      return [vertices[i * 2], vertices[(i * 2) + 1]]
    }

    function createTopoPolygon (area, geometry) {
      return {
        type: 'Polygon',
        area,
        arcs: [geometry]
      }
    }

    function getTriangleArea (vertices, triangleIndexArcs) {
      return Math.abs(
        polygonArea(map(triangleIndexArcs, arc => getPoint(vertices, arc[0])))
      )
    }

    /*
      Taken from flubber:
      https://github.com/veltman/flubber
    */

    const bisect = bisector(d => d.area).left;

    function findNeighbor (geoms) {
      // we assume the first geom is the candidate for which
      // we want to find a neighbor
      const sourceArcs = geoms[0].arcs[0].map(arc => arc < 0 ? ~arc : arc);

      let neighbor;

      // start loop at index 1, first possible neighbor
      for (let index = 1; index < geoms.length; index++) {
        const targetArcs = geoms[index].arcs[0].map(arc => arc < 0 ? ~arc : arc);
        if (sourceArcs.some(arc => targetArcs.includes(arc))) {
          neighbor = index;
          break
        }
      }
      return neighbor
    }

    function collapseTopology (topology, numberOfPieces) {
      const triangleGeometries = topology.objects.triangles.geometries;

      while (triangleGeometries.length > numberOfPieces) {
        mergeSmallestFeature();
      }

      if (numberOfPieces > triangleGeometries.length) {
        throw new RangeError('Can\'t collapse topology into ' + numberOfPieces + ' pieces.')
      }

      const geojson = feature(topology, topology.objects.triangles);
      const geojsonTriangleGeometries = map(geojson.features, feature => feature.geometry);

      return geojsonTriangleGeometries

      function mergeSmallestFeature () {
        const smallest = triangleGeometries[0];
        const neighborIndex = findNeighbor(triangleGeometries);
        const neighbor = triangleGeometries[neighborIndex];
        const merged = mergeArcs(topology, [smallest, neighbor]);

        // MultiPolygon -> Polygon
        merged.area = smallest.area + neighbor.area;
        merged.type = 'Polygon';
        merged.arcs = merged.arcs[0];

        // Delete smallest and its chosen neighbor
        triangleGeometries.splice(neighborIndex, 1);
        triangleGeometries.shift();

        // Add new merged shape in sorted order
        triangleGeometries.splice(bisect(triangleGeometries, merged.area), 0, merged);
      }
    }

    function createGeometries (vertices, triangleIndices) {
      const geometries = [];

      for (let i = 0; i < triangleIndices.length; i += 3) {
        const triangleIndexArcs = createTriangleIndexArcs(triangleIndices, i);

        let outerRing = map(triangleIndexArcs, arc => getPoint(vertices, arc[0]));
        outerRing.push(getPoint(vertices, triangleIndexArcs[0][0])); // close ring

        // earcut doesn't always give counterclockwise rings back
        if (linearRingIsClockwise(outerRing)) {
          outerRing = outerRing.reverse();
        }

        geometries.push({
          type: 'Polygon',
          coordinates: [outerRing]
        });
      }

      return geometries
    }

    function sliceUpTriangles (geometries, numberOfPieces) {
      const areas = map(geometries, polygonArea);

      const order = getOrderDescending(areas);

      const areasSorted = sortIntoOrder(areas, order);
      const geometriesSorted = sortIntoOrder(geometries, order);

      while (geometriesSorted.length < numberOfPieces) {
        areasSorted.shift();
        const biggestTriangle = geometriesSorted.shift();

        const cutTriangles = cutTriangleInTwo(biggestTriangle);

        const areaCutTriangles = map(cutTriangles, polygonArea);

        for (let i = 0; i < cutTriangles.length; i++) {
          const areaCutTriangle = areaCutTriangles[i];
          const cutTriangle = cutTriangles[i];

          const insertionIndex = getInsertionIndexDescending(areasSorted, areaCutTriangle);

          areasSorted.splice(insertionIndex, 0, areaCutTriangle);
          geometriesSorted.splice(insertionIndex, 0, cutTriangle);
        }
      }

      return geometriesSorted
    }

    function cutTriangleInTwo (triangle) {
      const a = triangle.coordinates[0][0];
      const b = triangle.coordinates[0][1];
      const c = triangle.coordinates[0][2];

      const pointBetweenAB = interpolate(a, b)(0.5);

      const firstTriangle = createTriangleGeometry([a, pointBetweenAB, c, a]);
      const secondTriangle = createTriangleGeometry([b, c, pointBetweenAB, b]);

      return [firstTriangle, secondTriangle]
    }

    function createTriangleGeometry (points) {
      return {
        type: 'Polygon',
        coordinates: [points]
      }
    }

    /*
      Inspired by flubber:
      https://github.com/veltman/flubber
    */

    const dimensions = 2;

    function cutPolygon (polygon, numberOfPieces) {
      if (numberOfPieces < 2) throw new Error('Cannot cut polygon in less than 2 pieces')

      const flattenedPolygon = earcut_1.flatten(polygon.coordinates);
      const triangleIndices = earcut_1(flattenedPolygon.vertices, flattenedPolygon.holes, dimensions);

      const numberOfTriangles = getNumberOfTriangles(triangleIndices);

      if (numberOfTriangles >= numberOfPieces) {
        const topology = createTopology(flattenedPolygon.vertices, triangleIndices);
        return collapseTopology(topology, numberOfPieces)
      }

      if (numberOfTriangles < numberOfPieces) {
        const triangleGeometries = createGeometries(flattenedPolygon.vertices, triangleIndices);
        return sliceUpTriangles(triangleGeometries, numberOfPieces)
      }
    }

    function getNumberOfTriangles (triangleIndices) {
      return triangleIndices.length / 3
    }

    function cutPolygons (polygons, numberOfDesiredAdditionalPolygons) {
      if (numberOfDesiredAdditionalPolygons < 1) throw wrongNumberOfPolygonsError

      const polygonAreas = map(polygons, polygonArea);
      const numberOfCutsPerPolygon = assignCuts(polygonAreas, numberOfDesiredAdditionalPolygons);

      let resultingPolygons = [];

      for (let i = 0; i < polygons.length; i++) {
        const polygon = polygons[i];
        const numberOfCuts = numberOfCutsPerPolygon[i];

        if (numberOfCuts === 0) {
          resultingPolygons.push(polygon);
        }

        if (numberOfCuts > 0) {
          const numberOfDesiredPolygons = numberOfCuts + 1;
          resultingPolygons = resultingPolygons.concat(cutPolygon(polygon, numberOfDesiredPolygons));
        }
      }

      return resultingPolygons
    }

    const wrongNumberOfPolygonsError = new Error('Number of desired additional polygons must be larger than 0');

    // https://stackoverflow.com/a/38905829/7237112
    function assignCuts (polygonAreas, numberOfPieces) {
      const numberOfCutsPerPolygon = [];
      let totalArea = sum(polygonAreas);

      for (let i = 0; i < polygonAreas.length; i++) {
        const area = polygonAreas[i];
        const numberOfCuts = Math.round(area / totalArea * numberOfPieces);

        numberOfCutsPerPolygon.push(numberOfCuts);
        totalArea -= area;
        numberOfPieces -= numberOfCuts;
      }

      return numberOfCutsPerPolygon
    }

    function sum (array) {
      let sum = 0;

      for (let i = 0; i < array.length; i++) {
        sum += array[i];
      }

      return sum
    }

    function combineIntoMultiPolygon (inputGeometries) {
      const multiPolygon = createEmptyMultiPolygon();

      for (const inputGeometry of inputGeometries) {
        if (inputGeometry.type === 'Polygon') {
          multiPolygon.coordinates.push(inputGeometry.coordinates);
        }

        if (inputGeometry.type === 'MultiPolygon') {
          for (const polygon of inputGeometry.coordinates) {
            multiPolygon.coordinates.push(polygon);
          }
        }
      }

      return multiPolygon
    }

    function splitMultiPolygon (multiPolygon) {
      const polygons = [];

      for (const polygonCoordinates of multiPolygon.coordinates) {
        const polygon = createEmptyPolygon();
        polygon.coordinates = polygonCoordinates;

        polygons.push(polygon);
      }

      return polygons
    }

    function createEmptyMultiPolygon () {
      return { type: 'MultiPolygon', coordinates: [] }
    }

    function createEmptyPolygon () {
      return { type: 'Polygon', coordinates: undefined }
    }

    function multiPolygonToMultiPolygon (from, to) {
      let fromPolygons = splitMultiPolygon(from);
      let toPolygons = splitMultiPolygon(to);

      const lengthDifference = fromPolygons.length - toPolygons.length;

      if (lengthDifference > 0) {
        toPolygons = cutPolygons(toPolygons, lengthDifference);
      }

      if (lengthDifference < 0) {
        fromPolygons = cutPolygons(fromPolygons, -lengthDifference);
      }

      return createInterpolatorPolygons(from, to, fromPolygons, toPolygons)
    }

    function createInterpolatorPolygons (from, to, fromPolygons, toPolygons) {
      const fromOuterRings = map(fromPolygons, polygon => polygon.coordinates[0]);
      const toOuterRings = map(toPolygons, polygon => polygon.coordinates[0]);

      const fromOrder = matchLinearRings(fromOuterRings, toOuterRings);
      fromPolygons = map(fromOrder, i => fromPolygons[i]);

      const polygonInterpolators = [];

      for (let i = 0; i < fromPolygons.length; i++) {
        const fromPolygon = fromPolygons[i];
        const toPolygon = toPolygons[i];

        polygonInterpolators.push(polygonToPolygon(fromPolygon, toPolygon));
      }

      return function interpolator (t) {
        if (t === 0) return from
        if (t === 1) return to

        return combineIntoMultiPolygon(
          map(polygonInterpolators, polygonInterpolator => polygonInterpolator(t))
        )
      }
    }

    function multiPolygonToPolygon (from, to) {
      const fromPolygons = splitMultiPolygon(from);
      let toPolygons = [to];

      const numberOfFromPolygons = fromPolygons.length;
      const numberOfAdditionalToPolygonsRequried = numberOfFromPolygons - 1;

      if (numberOfAdditionalToPolygonsRequried > 0) {
        toPolygons = cutPolygon(to, numberOfFromPolygons);
      }

      return createInterpolatorPolygons(from, to, fromPolygons, toPolygons)
    }

    function polygonToMultiPolygon (from, to) {
      const reverseInterpolator = multiPolygonToPolygon(to, from);

      return function interpolator (t) {
        return reverseInterpolator(1 - t)
      }
    }

    function lineStringtoLineString (from, to) {
      const [preparedFromCoordinates, preparedToCoordinates] = prepareCoordinates(
        from.coordinates, to.coordinates
      );

      return createInterpolator(from, to, preparedFromCoordinates, preparedToCoordinates)
    }

    function prepareCoordinates (fromCoordinates, toCoordinates) {
      const lengthDifference = fromCoordinates.length - toCoordinates.length;

      let preparedFromCoordinates = fromCoordinates;
      let preparedToCoordinates = toCoordinates;

      if (lengthDifference > 0) {
        preparedToCoordinates = insertPointsLineString(toCoordinates, lengthDifference);
      }

      if (lengthDifference < 0) {
        preparedFromCoordinates = insertPointsLineString(fromCoordinates, -lengthDifference);
      }

      preparedFromCoordinates = reverseIfBetterMatching(preparedFromCoordinates, preparedToCoordinates);

      return [preparedFromCoordinates, preparedToCoordinates]
    }

    function createInterpolator (from, to, preparedFromCoordinates, preparedToCoordinates) {
      const coordinateInterpolator = interpolate(preparedFromCoordinates, preparedToCoordinates);

      return function interpolator (t) {
        if (t === 0) return from
        if (t === 1) return to

        return {
          type: 'LineString',
          coordinates: coordinateInterpolator(t)
        }
      }
    }

    function reverseIfBetterMatching (from, to) {
      const normalTotalSquareDistance = getTotalSquaredDistancePositions(from, to);
      const fromReversed = cloneLinearRing(from).reverse();
      const reversedTotalSquareDistance = getTotalSquaredDistancePositions(fromReversed, to);

      if (normalTotalSquareDistance <= reversedTotalSquareDistance) {
        return from
      } else {
        return fromReversed
      }
    }

    function getTotalSquaredDistancePositions (from, to) {
      let totalSquaredDistance = 0;

      for (let i = 0; i < from.length; i++) {
        totalSquaredDistance += pointDistance(from[i], to[i]);
      }

      return totalSquaredDistance
    }

    function movePointAlongLine (a, b, distance) {
      const unitVector = getUnitVector$1(a, b);
      return movePoint$1(a, unitVector, distance)
    }

    function getUnitVector$1 (a, b) {
      const magnitude = pointDistance(a, b);
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];

      return [dx / magnitude, dy / magnitude]
    }

    function movePoint$1 (point, unitVector, distance) {
      return [
        point[0] + unitVector[0] * distance,
        point[1] + unitVector[1] * distance
      ]
    }

    function multiLineStringToLineString (from, to) {
      const numberOfFromLineStrings = from.coordinates.length;
      const preparedToCoordinates = cutLineString(to.coordinates, numberOfFromLineStrings);
      const lineStringInterpolators = createLineStringInterpolators(from.coordinates, preparedToCoordinates);

      return createMultiLineStringInterpolator(from, to, lineStringInterpolators)
    }

    function lineStringToMultiLineString (from, to) {
      const reverseInterpolator = multiLineStringToLineString(to, from);

      return function interpolator (t) {
        return reverseInterpolator(1 - t)
      }
    }

    function cutLineString (toCoordinates, numberOfLineStrings) {
      const multiLineStringCoordinates = [];

      const totalLengthTo = linearRingLength(toCoordinates);
      const desiredSegmentSize = totalLengthTo / numberOfLineStrings;

      const lastPointIndex = toCoordinates.length - 1;

      let currentSegment = [];
      let elapsedDistanceSinceLastCut = 0;

      for (let i = 0; i < lastPointIndex; i++) {
        const a = toCoordinates[i];
        currentSegment.push(a);
        const b = toCoordinates[i + 1];

        const distanceAB = pointDistance(a, b);
        const distanceIncludingCurrentSegment = elapsedDistanceSinceLastCut + distanceAB;

        if (distanceIncludingCurrentSegment < desiredSegmentSize) {
          elapsedDistanceSinceLastCut += distanceAB;
        }

        if (distanceIncludingCurrentSegment >= desiredSegmentSize) {
          const numberOfCuts = Math.floor(distanceIncludingCurrentSegment / desiredSegmentSize);

          const cutCoordinates = calculateCutCoordinates(
            a, b, elapsedDistanceSinceLastCut, desiredSegmentSize, numberOfCuts
          );

          currentSegment = currentSegment.concat(cutCoordinates);
          multiLineStringCoordinates.push(currentSegment);

          const lastCut = cutCoordinates[cutCoordinates.length - 1];

          if (pointsEqual(lastCut, b)) {
            currentSegment = [];
          } else {
            currentSegment = [lastCut];
          }

          elapsedDistanceSinceLastCut = pointDistance(lastCut, b);
        }
      }

      return multiLineStringCoordinates
    }

    function calculateCutCoordinates (a, b, offset, size, numberOfCuts) {
      const cuts = [];

      for (let i = 1; i <= numberOfCuts; i++) {
        cuts.push(movePointAlongLine(a, b, ((size * i) - offset)));
      }

      return cuts
    }

    function pointsEqual (a, b) {
      return a[0] === b[0] && a[1] === b[1]
    }

    function createLineStringInterpolators (fromCoordinates, toCoordinates) {
      const interpolators = [];

      for (let i = 0; i < fromCoordinates.length; i++) {
        const fromLineString = fromCoordinates[i];
        const toLineString = toCoordinates[i];

        const [preparedFromLineString, preparedToLineString] = prepareCoordinates(fromLineString, toLineString);
        const interpolator = interpolate(preparedFromLineString, preparedToLineString);
        interpolators.push(interpolator);
      }

      return interpolators
    }

    function createMultiLineStringInterpolator (from, to, lineStringInterpolators) {
      return function interpolator (t) {
        if (t === 0) return from
        if (t === 1) return to

        return {
          type: 'MultiLineString',
          coordinates: map(
            lineStringInterpolators,
            lineStringInterpolator => lineStringInterpolator(t)
          )
        }
      }
    }

    function matchLineStrings (input, target) {
      const inputOrder = getInputOrder(input, target);
      return inputOrder.map(i => input[i])
    }

    function getInputOrder (input, target) {
      const inputLengths = map(input, linearRingLength);
      const targetLengths = map(target, linearRingLength);

      const inputLengthOrderDescending = getOrderDescending(inputLengths);
      const targetLengthOrderDescending = getOrderDescending(targetLengths);

      const pairs = {};

      for (let i = 0; i < targetLengthOrderDescending.length; i++) {
        const inputIndex = inputLengthOrderDescending[i];
        const targetIndex = targetLengthOrderDescending[i];

        pairs[inputIndex] = targetIndex;
      }

      const inputOrder = [];

      for (let i = 0; i < target.length; i++) {
        inputOrder.push(pairs[i]);
      }

      return inputOrder
    }

    function multiLineStringToMultiLineString (from, to) {
      let fromLineStrings = from.coordinates;
      let toLineStrings = to.coordinates;

      const lengthDifference = fromLineStrings.length - toLineStrings.length;

      if (lengthDifference > 0) {
        toLineStrings = splitLineStrings(toLineStrings, lengthDifference);
      }

      if (lengthDifference < 0) {
        fromLineStrings = splitLineStrings(fromLineStrings, -lengthDifference);
      }

      fromLineStrings = matchLineStrings(fromLineStrings, toLineStrings);

      const lineStringInterpolators = createLineStringInterpolators(fromLineStrings, toLineStrings);

      return createMultiLineStringInterpolator(from, to, lineStringInterpolators)
    }

    function splitLineStrings (lineStrings, numberOfDesiredLineStrings) {
      const lineStringLengths = getLengths(lineStrings);
      const numberOfCutsPerLineString = assignCuts(lineStringLengths, numberOfDesiredLineStrings);

      let resultingLineStrings = [];

      for (let i = 0; i < numberOfCutsPerLineString.length; i++) {
        const lineString = lineStrings[i];
        const numberOfCuts = numberOfCutsPerLineString[i];

        if (numberOfCuts === 0) {
          resultingLineStrings.push(lineString);
        }

        if (numberOfCuts > 0) {
          const numberOfDesiredPieces = numberOfCuts + 1;

          resultingLineStrings = resultingLineStrings.concat(
            cutLineString(lineString, numberOfDesiredPieces)
          );
        }
      }

      return resultingLineStrings
    }

    function getLengths (lineStrings) {
      const lengths = [];

      for (let i = 0; i < lineStrings.length; i++) {
        lengths.push(
          linearRingLength(lineStrings[i])
        );
      }

      return lengths
    }

    function transshape (from, to) {
      ensureValidInput(from, to);

      // Polygon transitions
      if (from.type === 'Polygon' && to.type === 'Polygon') {
        return polygonToPolygon(from, to)
      }

      if (from.type === 'MultiPolygon' && to.type === 'Polygon') {
        return multiPolygonToPolygon(from, to)
      }

      if (from.type === 'Polygon' && to.type === 'MultiPolygon') {
        return polygonToMultiPolygon(from, to)
      }

      if (from.type === 'MultiPolygon' && to.type === 'MultiPolygon') {
        return multiPolygonToMultiPolygon(from, to)
      }

      // LineString transitions
      if (from.type === 'LineString' && to.type === 'LineString') {
        return lineStringtoLineString(from, to)
      }

      if (from.type === 'MultiLineString' && to.type === 'LineString') {
        return multiLineStringToLineString(from, to)
      }

      if (from.type === 'LineString' && to.type === 'MultiLineString') {
        return lineStringToMultiLineString(from, to)
      }

      if (from.type === 'MultiLineString' && to.type === 'MultiLineString') {
        return multiLineStringToMultiLineString(from, to)
      }
    }

    function ensureValidInput (from, to) {
      if (bothPolygons(from, to) || bothLines(from, to)) {
        return
      }

      throw new Error('Invalid input')
    }

    function bothPolygons (from, to) {
      return isPolygonOrMultiPolygon(from) && isPolygonOrMultiPolygon(to)
    }

    function bothLines (from, to) {
      return isLineStringOrMultiLineString(from) && isLineStringOrMultiLineString(to)
    }

    function transitionGeometry (fromGeometry, toGeometry) {
      if (pointTransition(fromGeometry, toGeometry)) {
        return interpolate$2(fromGeometry, toGeometry)
      }

      if (polygonTransition(fromGeometry, toGeometry)) {
        return transshape(fromGeometry, toGeometry)
      }

      if (lineStringTransition(fromGeometry, toGeometry)) {
        return transshape(fromGeometry, toGeometry)
      }

      throw new Error('Invalid input')
    }

    function transitionGeometries (fromLayer, toLayer) {
      const firstFromGeometry = getFirstGeometry(fromLayer);
      const firstToGeometry = getFirstGeometry(toLayer);

      if (pointTransition(firstFromGeometry, firstToGeometry)) {
        return transitionLayer(fromLayer, toLayer, interpolate$2)
      }

      if (polygonTransition(firstFromGeometry, firstToGeometry)) {
        return transitionLayer(fromLayer, toLayer, transshape)
      }

      if (lineStringTransition(firstFromGeometry, firstToGeometry)) {
        return transitionLayer(fromLayer, toLayer, transshape)
      }

      throw new Error('Invalid input')
    }

    function pointTransition (fromGeometry, toGeometry) {
      return fromGeometry.type === 'Point' && toGeometry.type === 'Point'
    }

    const polygonTypes = ['Polygon', 'MultiPolygon'];

    function polygonTransition (fromGeometry, toGeometry) {
      return polygonTypes.includes(fromGeometry.type) &&
        polygonTypes.includes(toGeometry.type)
    }

    const lineStringTypes = ['LineString', 'MultiLineString'];

    function lineStringTransition (fromGeometry, toGeometry) {
      return lineStringTypes.includes(fromGeometry.type) &&
        lineStringTypes.includes(toGeometry.type)
    }

    function getFirstGeometry (layer) {
      return layer[Object.keys(layer)[0]]
    }

    function transitionLayer (fromLayer, toLayer, interpolationMethod) {
      const interpolatorObject = {};

      for (const key in toLayer) {
        if (key in fromLayer) {
          interpolatorObject[key] = interpolationMethod(fromLayer[key], toLayer[key]);
        } else {
          interpolatorObject[key] = () => toLayer[key];
        }
      }

      return function interpolator (t) {
        if (t === 0) return fromLayer
        if (t === 1) return toLayer

        const layer = {};
        for (const key in interpolatorObject) {
          layer[key] = interpolatorObject[key](t);
        }

        return layer
      }
    }

    function createItemFromBbox (bbox) {
      return {
        minX: bbox.x[0],
        maxX: bbox.x[1],
        minY: bbox.y[0],
        maxY: bbox.y[1]
      }
    }

    function indexRectangle$1 (markData) {
      const rectangleAttributes = markData.attributes;

      const bbox = calculateBboxGeometry(rectangleAttributes.screenGeometry);
      const item = createItemFromBbox(bbox);

      item.attributes = rectangleAttributes;
      item.markType = 'Rectangle';
      item.markId = markData.markId;

      return item
    }

    function indexRectangleLayer$1 ({ layerAttributes, keyArray, layerId }) {
      const items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        const rectangleAttributes = getRectangleAttributes$1(layerAttributes, key);
        const bbox = calculateBboxGeometry(rectangleAttributes.screenGeometry);
        const item = createItemFromBbox(bbox);

        item.key = key;
        item.index = i;
        item.attributes = rectangleAttributes;
        item.markType = 'Rectangle';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function getRectangleAttributes$1 (layerAttributes, key) {
      return { screenGeometry: layerAttributes.screenGeometryObject[key] }
    }

    function indexPolygon$1 (markData) {
      const polygonAttributes = markData.attributes;

      const bbox = calculateBboxGeometry(polygonAttributes.screenGeometry);
      const item = createItemFromBbox(bbox);

      item.attributes = polygonAttributes;
      item.markType = 'Polygon';
      item.markId = markData.markId;

      return item
    }

    function indexPolygonLayer$1 ({ layerAttributes, keyArray, layerId }) {
      const items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        const polygonAttributes = getPolygonAttributes$1(layerAttributes, key);
        const bbox = calculateBboxGeometry(polygonAttributes.screenGeometry);
        const item = createItemFromBbox(bbox);

        item.key = key;
        item.index = i;
        item.attributes = polygonAttributes;
        item.markType = 'Polygon';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function getPolygonAttributes$1 (layerAttributes, key) {
      return { screenGeometry: layerAttributes.screenGeometryObject[key] }
    }

    function indexLine$1 (markData) {
      const lineAttributes = markData.attributes;
      const markId = markData.markId;

      const pixelGeometry = lineAttributes.pixelGeometry;
      const lineStringCoords = pixelGeometry.coordinates;

      if (pixelGeometry.type === 'LineString') {
        return indexLineString(lineStringCoords, lineAttributes, markId)
      }

      if (pixelGeometry.type === 'MultiLineString') {
        return indexMultiLineString(lineStringCoords, lineAttributes, markId)
      }
    }

    function indexLineString (lineStringCoords, lineAttributes, markId, lineStringIndex) {
      const indexableSegments = [];

      for (let i = 0; i < lineStringCoords.length - 1; i++) {
        const segment = [lineStringCoords[i], lineStringCoords[i + 1]];

        const item = createSegmentItem(segment, lineAttributes, i);
        if (lineStringIndex) {
          // Only for MultiLineStrings
          item.lineStringIndex = lineStringIndex;
        }
        item.markId = markId;
        indexableSegments.push(item);
      }

      return indexableSegments
    }

    function indexMultiLineString (lineStringCoords, lineAttributes, markId) {
      let indexableSegments = [];

      for (let lineStringIndex = 0; lineStringIndex < lineStringCoords.length; lineStringIndex++) {
        indexableSegments = indexableSegments.concat(indexLineString(
          lineStringCoords[lineStringIndex], lineAttributes, markId, lineStringIndex
        ));
      }

      return indexableSegments
    }

    function createSegmentItem (segment, attributes, i) {
      const segmentGeometry = { type: 'LineString', coordinates: segment };
      const bbox = calculateBboxGeometry(segmentGeometry);
      let item = createItemFromBbox(bbox);
      item = takeIntoAccountStrokeWidth(item, attributes.strokeWidth);

      item.attributes = {};
      item.attributes.strokeWidth = attributes.strokeWidth;
      item.attributes.segmentGeometry = segmentGeometry;
      item.markType = 'Line';
      item.segmentIndex = i;

      return item
    }

    function takeIntoAccountStrokeWidth (item, strokeWidth) {
      const halfStrokeWidth = strokeWidth / 2;

      const newBbox = {
        minX: item.minX - halfStrokeWidth,
        maxX: item.maxX + halfStrokeWidth,
        minY: item.minY - halfStrokeWidth,
        maxY: item.maxY + halfStrokeWidth
      };

      return Object.assign(item, newBbox)
    }

    function indexLineLayer$1 ({ layerAttributes, keyArray, layerId }) {
      let items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];
        const lineAttributes = createLineAttributes(layerAttributes, key);
        const pixelGeometry = lineAttributes.pixelGeometry;
        const lineStringCoords = pixelGeometry.coordinates;

        if (pixelGeometry.type === 'LineString') {
          let segments = indexLineString(
            lineStringCoords, lineAttributes, key
          );

          segments = modifyForLayer(segments, layerId, key, i);
          items = items.concat(segments);
        }

        if (pixelGeometry.type === 'MultiLineString') {
          let segments = indexMultiLineString(
            lineStringCoords, lineAttributes, key
          );

          segments = modifyForLayer(segments, layerId, key, i);
          items = items.concat(segments);
        }
      }

      return items
    }

    function createLineAttributes (attributes, key) {
      return {
        pixelGeometry: attributes.pixelGeometryObject[key],
        strokeWidth: attributes.strokeWidthObject[key]
      }
    }

    function modifyForLayer (segments, layerId, key, index) {
      for (let i = 0; i < segments.length; i++) {
        const segmentItem = segments[i];
        delete segmentItem.markId;

        segmentItem.layerId = layerId;
        segmentItem.key = key;
        segmentItem.index = index;
      }

      return segments
    }

    function indexArea$1 (markData) {
      const areaAttributes = markData.attributes;

      const bbox = calculateBboxGeometry(areaAttributes.screenGeometry);
      const item = createItemFromBbox(bbox);

      item.attributes = areaAttributes;
      item.markType = 'Area';
      item.markId = markData.markId;

      return item
    }

    function indexAreaLayer$1 ({ layerAttributes, keyArray, layerId }) {
      const items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        const areaAttributes = getAreaAttributes$1(layerAttributes, key);
        const bbox = calculateBboxGeometry(areaAttributes.screenGeometry);
        const item = createItemFromBbox(bbox);

        item.key = key;
        item.index = i;
        item.attributes = areaAttributes;
        item.markType = 'Area';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function getAreaAttributes$1 (layerAttributes, key) {
      return { screenGeometry: layerAttributes.screenGeometryObject[key] }
    }

    function indexSymbol (markData) {
      const symbolAttributes = markData.attributes;

      const bbox = calculateBboxGeometry(symbolAttributes.screenGeometry);
      const item = createItemFromBbox(bbox);

      item.attributes = symbolAttributes;
      item.markType = 'Symbol';
      item.markId = markData.markId;

      return item
    }

    function indexSymbolLayer ({ layerAttributes, keyArray, layerId }) {
      const items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        const symbolAttributes = getSymbolAttributes(layerAttributes, key);
        const bbox = calculateBboxGeometry(symbolAttributes.screenGeometry);
        const item = createItemFromBbox(bbox);

        item.key = key;
        item.index = i;
        item.attributes = symbolAttributes;
        item.markType = 'Symbol';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function getSymbolAttributes (layerAttributes, key) {
      return { screenGeometry: layerAttributes.screenGeometryObject[key] }
    }

    const markIndexing$1 = {
      Point: indexPoint$1,
      Rectangle: indexRectangle$1,
      Polygon: indexPolygon$1,
      Line: indexLine$1,
      Label: indexPoint$1,
      Area: indexArea$1,
      Symbol: indexSymbol
    };

    const layerIndexing$1 = {
      Point: indexPointLayer$1,
      Rectangle: indexRectangleLayer$1,
      Polygon: indexPolygonLayer$1,
      Line: indexLineLayer$1,
      Label: indexPointLayer$1,
      Area: indexAreaLayer$1,
      Symbol: indexSymbolLayer
    };

    class MarkInteractionInterface extends BaseInteractionInterface {
      constructor (interactionManager, InteractionHandlers) {
        super(interactionManager, InteractionHandlers);

        this._indexableMarks = {};
        this._indexableLayers = {};
      }

      // Mark loading and removing
      loadMark (markType, markData) {
        const indexingFunction = markIndexing$1[markType];
        const indexableMark = indexingFunction(markData);

        const markId = markData.markId;
        this._indexableMarks[markId] = indexableMark;
      }

      markIsLoaded (markId) {
        return markId in this._indexableMarks
      }

      removeMark (markId) {
        delete this._indexableMarks[markId];
      }

      // Layer loading and removing
      loadLayer (layerType, layerData) {
        const indexingFunction = layerIndexing$1[layerType];
        const indexableLayer = indexingFunction(layerData);

        const layerId = layerData.layerId;
        this._indexableLayers[layerId] = indexableLayer;
      }

      layerIsLoaded (layerId) {
        return layerId in this._indexableLayers
      }

      removeLayer (layerId) {
        delete this._indexableLayers[layerId];
      }

      // Add/remove mark interactions
      addMarkInteraction (interactionName, markId, callback) {
        this._getHandler(interactionName).addMarkInteraction(markId, callback);
      }

      removeAllMarkInteractions (markId) {
        for (const handlerName in this._handlers) {
          const handler = this._handlers[handlerName];

          if (handler.hasMark(markId)) {
            handler.removeMarkInteraction(markId);
          }
        }
      }

      // Add/remove layer interactions
      addLayerInteraction (interactionName, layerId, callback) {
        this._getHandler(interactionName).addLayerInteraction(layerId, callback);
      }

      removeAllLayerInteractions (layerId) {
        for (const handlerName in this._handlers) {
          const handler = this._handlers[handlerName];

          if (handler.hasLayer(layerId)) {
            handler.removeLayerInteraction(layerId);
          }
        }
      }
    }

    class SectionInteractionInterface extends BaseInteractionInterface {
      addInteraction (interactionName, callback) {
        this._getHandler(interactionName).addInteraction(callback);
      }

      removeAllInteractions () {
        for (const handlerName in this._handlers) {
          const handler = this._handlers[handlerName];

          if (handler.hasInteraction()) {
            handler.removeInteraction();
          }
        }
      }
    }

    class BaseInteractionHandler {
      constructor (interactionManager, { eventName, interactionName }) {
        this._interactionManager = interactionManager;
        this._eventName = eventName;
        this._interactionName = interactionName;
      }

      interactionManager () {
        return this._interactionManager
      }

      eventManager () {
        return this._interactionManager._eventManager
      }

      section () {
        return this._interactionManager._section
      }

      id () {
        return this._interactionManager._id
      }

      _addEventListener () {
        const handler = this._handleEvent.bind(this);

        const eventManager = this.eventManager();
        const listenerId = this.getId();

        const events = isArray(this._eventName) ? this._eventName : [this._eventName];

        for (const event of events) {
          eventManager
            .eventTracker(event)
            .addListener(listenerId, handler);
        }
      }

      _removeEventListener () {
        const eventManager = this.eventManager();
        const listenerId = this.getId();

        const events = isArray(this._eventName) ? this._eventName : [this._eventName];

        for (const event of events) {
          eventManager
            .eventTracker(event)
            .removeListener(listenerId);
        }
      }
    }

    function isArray (value) {
      return value.constructor === Array
    }

    var rbush_min = createCommonjsModule(function (module, exports) {
    !function(t,i){module.exports=i();}(commonjsGlobal,function(){function t(t,r,e,a,h){!function t(n,r,e,a,h){for(;a>e;){if(a-e>600){var o=a-e+1,s=r-e+1,l=Math.log(o),f=.5*Math.exp(2*l/3),u=.5*Math.sqrt(l*f*(o-f)/o)*(s-o/2<0?-1:1),m=Math.max(e,Math.floor(r-s*f/o+u)),c=Math.min(a,Math.floor(r+(o-s)*f/o+u));t(n,r,m,c,h);}var p=n[r],d=e,x=a;for(i(n,e,r),h(n[a],p)>0&&i(n,e,a);d<x;){for(i(n,d,x),d++,x--;h(n[d],p)<0;)d++;for(;h(n[x],p)>0;)x--;}0===h(n[e],p)?i(n,e,x):i(n,++x,a),x<=r&&(e=x+1),r<=x&&(a=x-1);}}(t,r,e||0,a||t.length-1,h||n);}function i(t,i,n){var r=t[i];t[i]=t[n],t[n]=r;}function n(t,i){return t<i?-1:t>i?1:0}var r=function(t){void 0===t&&(t=9),this._maxEntries=Math.max(4,t),this._minEntries=Math.max(2,Math.ceil(.4*this._maxEntries)),this.clear();};function e(t,i,n){if(!n)return i.indexOf(t);for(var r=0;r<i.length;r++)if(n(t,i[r]))return r;return -1}function a(t,i){h(t,0,t.children.length,i,t);}function h(t,i,n,r,e){e||(e=p(null)),e.minX=1/0,e.minY=1/0,e.maxX=-1/0,e.maxY=-1/0;for(var a=i;a<n;a++){var h=t.children[a];o(e,t.leaf?r(h):h);}return e}function o(t,i){return t.minX=Math.min(t.minX,i.minX),t.minY=Math.min(t.minY,i.minY),t.maxX=Math.max(t.maxX,i.maxX),t.maxY=Math.max(t.maxY,i.maxY),t}function s(t,i){return t.minX-i.minX}function l(t,i){return t.minY-i.minY}function f(t){return (t.maxX-t.minX)*(t.maxY-t.minY)}function u(t){return t.maxX-t.minX+(t.maxY-t.minY)}function m(t,i){return t.minX<=i.minX&&t.minY<=i.minY&&i.maxX<=t.maxX&&i.maxY<=t.maxY}function c(t,i){return i.minX<=t.maxX&&i.minY<=t.maxY&&i.maxX>=t.minX&&i.maxY>=t.minY}function p(t){return {children:t,height:1,leaf:!0,minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function d(i,n,r,e,a){for(var h=[n,r];h.length;)if(!((r=h.pop())-(n=h.pop())<=e)){var o=n+Math.ceil((r-n)/e/2)*e;t(i,o,n,r,a),h.push(n,o,o,r);}}return r.prototype.all=function(){return this._all(this.data,[])},r.prototype.search=function(t){var i=this.data,n=[];if(!c(t,i))return n;for(var r=this.toBBox,e=[];i;){for(var a=0;a<i.children.length;a++){var h=i.children[a],o=i.leaf?r(h):h;c(t,o)&&(i.leaf?n.push(h):m(t,o)?this._all(h,n):e.push(h));}i=e.pop();}return n},r.prototype.collides=function(t){var i=this.data;if(!c(t,i))return !1;for(var n=[];i;){for(var r=0;r<i.children.length;r++){var e=i.children[r],a=i.leaf?this.toBBox(e):e;if(c(t,a)){if(i.leaf||m(t,a))return !0;n.push(e);}}i=n.pop();}return !1},r.prototype.load=function(t){if(!t||!t.length)return this;if(t.length<this._minEntries){for(var i=0;i<t.length;i++)this.insert(t[i]);return this}var n=this._build(t.slice(),0,t.length-1,0);if(this.data.children.length)if(this.data.height===n.height)this._splitRoot(this.data,n);else {if(this.data.height<n.height){var r=this.data;this.data=n,n=r;}this._insert(n,this.data.height-n.height-1,!0);}else this.data=n;return this},r.prototype.insert=function(t){return t&&this._insert(t,this.data.height-1),this},r.prototype.clear=function(){return this.data=p([]),this},r.prototype.remove=function(t,i){if(!t)return this;for(var n,r,a,h=this.data,o=this.toBBox(t),s=[],l=[];h||s.length;){if(h||(h=s.pop(),r=s[s.length-1],n=l.pop(),a=!0),h.leaf){var f=e(t,h.children,i);if(-1!==f)return h.children.splice(f,1),s.push(h),this._condense(s),this}a||h.leaf||!m(h,o)?r?(n++,h=r.children[n],a=!1):h=null:(s.push(h),l.push(n),n=0,r=h,h=h.children[0]);}return this},r.prototype.toBBox=function(t){return t},r.prototype.compareMinX=function(t,i){return t.minX-i.minX},r.prototype.compareMinY=function(t,i){return t.minY-i.minY},r.prototype.toJSON=function(){return this.data},r.prototype.fromJSON=function(t){return this.data=t,this},r.prototype._all=function(t,i){for(var n=[];t;)t.leaf?i.push.apply(i,t.children):n.push.apply(n,t.children),t=n.pop();return i},r.prototype._build=function(t,i,n,r){var e,h=n-i+1,o=this._maxEntries;if(h<=o)return a(e=p(t.slice(i,n+1)),this.toBBox),e;r||(r=Math.ceil(Math.log(h)/Math.log(o)),o=Math.ceil(h/Math.pow(o,r-1))),(e=p([])).leaf=!1,e.height=r;var s=Math.ceil(h/o),l=s*Math.ceil(Math.sqrt(o));d(t,i,n,l,this.compareMinX);for(var f=i;f<=n;f+=l){var u=Math.min(f+l-1,n);d(t,f,u,s,this.compareMinY);for(var m=f;m<=u;m+=s){var c=Math.min(m+s-1,u);e.children.push(this._build(t,m,c,r-1));}}return a(e,this.toBBox),e},r.prototype._chooseSubtree=function(t,i,n,r){for(;r.push(i),!i.leaf&&r.length-1!==n;){for(var e=1/0,a=1/0,h=void 0,o=0;o<i.children.length;o++){var s=i.children[o],l=f(s),u=(m=t,c=s,(Math.max(c.maxX,m.maxX)-Math.min(c.minX,m.minX))*(Math.max(c.maxY,m.maxY)-Math.min(c.minY,m.minY))-l);u<a?(a=u,e=l<e?l:e,h=s):u===a&&l<e&&(e=l,h=s);}i=h||i.children[0];}var m,c;return i},r.prototype._insert=function(t,i,n){var r=n?t:this.toBBox(t),e=[],a=this._chooseSubtree(r,this.data,i,e);for(a.children.push(t),o(a,r);i>=0&&e[i].children.length>this._maxEntries;)this._split(e,i),i--;this._adjustParentBBoxes(r,e,i);},r.prototype._split=function(t,i){var n=t[i],r=n.children.length,e=this._minEntries;this._chooseSplitAxis(n,e,r);var h=this._chooseSplitIndex(n,e,r),o=p(n.children.splice(h,n.children.length-h));o.height=n.height,o.leaf=n.leaf,a(n,this.toBBox),a(o,this.toBBox),i?t[i-1].children.push(o):this._splitRoot(n,o);},r.prototype._splitRoot=function(t,i){this.data=p([t,i]),this.data.height=t.height+1,this.data.leaf=!1,a(this.data,this.toBBox);},r.prototype._chooseSplitIndex=function(t,i,n){for(var r,e,a,o,s,l,u,m=1/0,c=1/0,p=i;p<=n-i;p++){var d=h(t,0,p,this.toBBox),x=h(t,p,n,this.toBBox),v=(e=d,a=x,o=void 0,s=void 0,l=void 0,u=void 0,o=Math.max(e.minX,a.minX),s=Math.max(e.minY,a.minY),l=Math.min(e.maxX,a.maxX),u=Math.min(e.maxY,a.maxY),Math.max(0,l-o)*Math.max(0,u-s)),M=f(d)+f(x);v<m?(m=v,r=p,c=M<c?M:c):v===m&&M<c&&(c=M,r=p);}return r||n-i},r.prototype._chooseSplitAxis=function(t,i,n){var r=t.leaf?this.compareMinX:s,e=t.leaf?this.compareMinY:l;this._allDistMargin(t,i,n,r)<this._allDistMargin(t,i,n,e)&&t.children.sort(r);},r.prototype._allDistMargin=function(t,i,n,r){t.children.sort(r);for(var e=this.toBBox,a=h(t,0,i,e),s=h(t,n-i,n,e),l=u(a)+u(s),f=i;f<n-i;f++){var m=t.children[f];o(a,t.leaf?e(m):m),l+=u(a);}for(var c=n-i-1;c>=i;c--){var p=t.children[c];o(s,t.leaf?e(p):p),l+=u(s);}return l},r.prototype._adjustParentBBoxes=function(t,i,n){for(var r=n;r>=0;r--)o(i[r],t);},r.prototype._condense=function(t){for(var i=t.length-1,n=void 0;i>=0;i--)0===t[i].children.length?i>0?(n=t[i-1].children).splice(n.indexOf(t[i]),1):this.clear():a(t[i],this.toBBox);},r});
    });

    function pointCollision (coordinates, pointAttributes) {
      const distance = pointDistance$2(
        [coordinates.x, coordinates.y],
        pointAttributes.pixelGeometry.coordinates
      );

      return distance < pointAttributes.radius
    }

    function rectangleCollision (coordinates, rectangleAttributes) {
      const point = [coordinates.x, coordinates.y];
      return pointInPolygon(point, rectangleAttributes.screenGeometry)
    }

    function polygonCollision (coordinates, polygonAttributes) {
      const point = [coordinates.x, coordinates.y];
      return pointInPolygon(point, polygonAttributes.screenGeometry)
    }

    function lineCollision (coordinates, lineAttributes) {
      const mouseCoordinates = [coordinates.x, coordinates.y];
      return pointIntersectsLineSegment(
        mouseCoordinates,
        lineAttributes.segmentGeometry.coordinates,
        lineAttributes.strokeWidth
      )
    }

    function symbolCollision (coordinates, symbolAttributes) {
      const point = [coordinates.x, coordinates.y];
      return pointInPolygon(point, symbolAttributes.screenGeometry)
    }

    function areaCollision (coordinates, areaAttributes) {
      const point = [coordinates.x, coordinates.y];
      return pointInPolygon(point, areaAttributes.screenGeometry)
    }

    var collisionTests = {
      Point: pointCollision,
      Rectangle: rectangleCollision,
      Polygon: polygonCollision,
      Line: lineCollision,
      Label: pointCollision,
      Symbol: symbolCollision,
      Area: areaCollision
    };

    class SpatialIndex {
      constructor (interactionHandler, getMark, getLayer) {
        this._rbush = new rbush_min();
        this._interactionHandler = interactionHandler;

        this._getMark = getMark.bind(interactionHandler);
        this._getLayer = getLayer.bind(interactionHandler);
      }

      // Layer indexing and unindexing
      indexLayer (layerId) {
        const layer = this._getLayer(layerId);
        this._rbush.load(layer);
      }

      unindexLayer (layerId) {
        const layer = this._getLayer(layerId);

        for (let i = 0; i < layer.length; i++) {
          const item = layer[i];
          this._rbush.remove(item);
        }
      }

      // Mark loading and removing
      indexMark (markId) {
        const mark = this._getMark(markId);

        if (multipleSegments(mark)) {
          this._rbush.load(mark);
        } else {
          this._rbush.insert(mark);
        }
      }

      unindexMark (markId) {
        const mark = this._getMark(markId);

        if (multipleSegments(mark)) {
          for (let i = 0; i < mark.length; i++) {
            const item = mark[i];
            this._rbush.remove(item);
          }
        } else {
          this._rbush.remove(mark);
        }
      }

      // Query functions
      queryMouseCoordinates (mouseCoordinates, radius) {
        const searchArea = searchAreaFromCoordinates(mouseCoordinates, radius);
        const indexQueryResults = this._rbush.search(searchArea);

        return this._getHits(mouseCoordinates, indexQueryResults)
      }

      queryBoundingBox (boundingBox) {
        return this._rbush.search(boundingBox)
      }

      // Internal
      _getHits (coordinates, indexQueryResults) {
        const hits = [];

        for (let i = 0; i < indexQueryResults.length; i++) {
          const indexQueryResult = indexQueryResults[i];
          const collisionTest = collisionTests[indexQueryResult.markType];

          if (collisionTest(coordinates, indexQueryResult.attributes)) {
            hits.push(indexQueryResult);
          }
        }

        return hits
      }
    }

    function searchAreaFromCoordinates (coordinates, radius = 3) {
      return {
        minX: coordinates.x - radius,
        maxX: coordinates.x + radius,
        minY: coordinates.y - radius,
        maxY: coordinates.y + radius
      }
    }

    function multipleSegments (indexableItem) {
      return indexableItem.constructor === Array
    }

    class MarkInteractionHandler extends BaseInteractionHandler {
      constructor (interactionManager, options) {
        super(interactionManager, options);

        const getMark = function (markId) {
          return this._interactionManager.marks()._indexableMarks[markId]
        };

        const getLayer = function (layerId) {
          return this._interactionManager.marks()._indexableLayers[layerId]
        };

        this._spatialIndex = new SpatialIndex(this, getMark, getLayer);

        this._numberOfInteractions = 0;

        this._markCallbacks = {};
        this._layerCallbacks = {};
      }

      // Add/remove mark interactions
      addMarkInteraction (markId, callback) {
        this._addEventListenerIfNecessary();
        this._numberOfInteractions++;
        this._markCallbacks[markId] = callback;

        this._spatialIndex.indexMark(markId);
      }

      hasMark (markId) {
        return markId in this._markCallbacks
      }

      removeMarkInteraction (markId) {
        this._removeEventListenerIfNecessary();
        delete this._markCallbacks[markId];
        this._numberOfInteractions--;

        this._spatialIndex.unindexMark(markId);
      }

      // Add/remove layer interactions
      addLayerInteraction (layerId, callback) {
        if (!(layerId in this._layerCallbacks)) {
          this._addEventListenerIfNecessary();
          this._numberOfInteractions++;
          this._layerCallbacks[layerId] = callback;

          this._spatialIndex.indexLayer(layerId);
        }
      }

      hasLayer (layerId) {
        return layerId in this._layerCallbacks
      }

      removeLayerInteraction (layerId) {
        if (layerId in this._layerCallbacks) {
          this._numberOfInteractions--;
          delete this._layerCallbacks[layerId];
          this._removeEventListenerIfNecessary();

          this._spatialIndex.unindexLayer(layerId);
        }
      }

      _addEventListenerIfNecessary () {
        if (this._numberOfInteractions === 0) {
          this._addEventListener();
        }
      }

      _removeEventListenerIfNecessary () {
        if (this._numberOfInteractions === 0) {
          this._removeEventListener();
        }
      }

      getId () {
        return `${this.id()}-mark-${this._interactionName}`
      }
    }

    function createMarkEvent (eventType, eventOptions, hit, nativeEvent) {
      eventOptions.markType = hit.markType;
      eventOptions.hitBbox = extractBbox(hit);
      eventOptions.hitSource = 'mark';

      return createEvent(eventType, eventOptions, nativeEvent)
    }

    function createLayerEvent (eventType, eventOptions, hit, nativeEvent) {
      eventOptions.markType = hit.markType;
      eventOptions.hitBbox = extractBbox(hit);
      eventOptions.key = hit.key;
      eventOptions.index = hit.index;
      eventOptions.hitSource = 'layer';

      return createEvent(eventType, eventOptions, nativeEvent)
    }

    function createSectionEvent (eventType, eventOptions, nativeEvent) {
      eventOptions.hitSource = 'section';

      return createEvent(eventType, eventOptions, nativeEvent)
    }

    function extractBbox (hit) {
      return { minX: hit.minX, maxX: hit.maxX, minY: hit.minY, maxY: hit.maxY }
    }

    function createEvent (eventType, eventOptions, nativeEvent) {
      const event = eventOptions;

      event.type = eventType;
      event.nativeType = nativeEvent.type;

      for (const key of INTERESTING_NATIVE_KEYS) {
        event[key] = nativeEvent[key];
      }

      return event
    }

    const INTERESTING_NATIVE_KEYS = [
      'altKey', 'ctrlKey', 'shiftKey',
      'clientX', 'clientY',
      'pageX', 'pageY',
      'screenX', 'screenY',
      'timeStamp'
    ];

    function createSelectMarkEvent (eventType, hit) {
      const event = {
        type: eventType,
        markType: hit.markType,
        hitSource: 'mark'
      };

      return event
    }

    function createSelectLayerEvent (eventType, hit) {
      const event = {
        type: eventType,
        markType: hit.markType,
        key: hit.key,
        index: hit.index,
        hitSource: 'layer'
      };

      return event
    }

    function getLocalCoordinates (screenCoordinates, interactionManager) {
      const section = interactionManager._section;
      const inverseTotalTransformation = section.inverseTotalTransformation;

      const { minX, maxX, minY, maxY } = section.paddedBbox;

      const clampedX = clamp(screenCoordinates.x, minX, maxX);
      const clampedY = clamp(screenCoordinates.y, minY, maxY);

      const [localX, localY] = inverseTotalTransformation([clampedX, clampedY]);

      return { x: localX, y: localY }
    }

    function clamp (value, min, max) {
      return Math.max(min, Math.min(value, max))
    }

    function coordinatesAreInsideSection (hit, section) {
      const bbox = section.bbox;

      return (
        hit.x >= bbox.minX &&
        hit.x <= bbox.maxX &&
        hit.y >= bbox.minY &&
        hit.y <= bbox.maxY
      )
    }

    function hitIsMark (hit) {
      return 'markId' in hit
    }

    function hitIsInLayer (hit) {
      return 'layerId' in hit
    }

    function getHitId (hit) {
      if (hitIsMark(hit)) return hit.markId
      if (hitIsInLayer(hit)) return hit.layerId + '-' + hit.key
    }

    class ClickHandler$1 extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'click',
          eventName: 'click'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];

          if (hitIsMark(hit)) {
            const clickEvent = createMarkEvent('click', {
              screenCoordinates,
              localCoordinates
            }, hit, nativeEvent);

            this._markCallbacks[hit.markId](clickEvent);
          }

          if (hitIsInLayer(hit)) {
            const clickEvent = createLayerEvent('click', {
              screenCoordinates,
              localCoordinates
            }, hit, nativeEvent);

            this._layerCallbacks[hit.layerId](clickEvent);
          }
        }
      }
    }

    class MouseoverHandler$1 extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'mouseover',
          eventName: 'mousemove'
        });

        this._previousMouseoverIds = {};
        this._currentMouseoverIds = {};
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitId = getHitId(hit);

          this._currentMouseoverIds[hitId] = true;

          if (!(hitId in this._previousMouseoverIds)) {
            this._fireCallback(hit, screenCoordinates, nativeEvent);
          }
        }

        this._previousMouseoverIds = this._currentMouseoverIds;
        this._currentMouseoverIds = {};
      }

      _fireCallback (hit, screenCoordinates, nativeEvent) {
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        if (hitIsMark(hit)) {
          const mouseoverEvent = createMarkEvent('mouseover', {
            screenCoordinates,
            localCoordinates
          }, hit, nativeEvent);

          this._markCallbacks[hit.markId](mouseoverEvent);
        }

        if (hitIsInLayer(hit)) {
          const mouseoverEvent = createLayerEvent('mouseover', {
            screenCoordinates,
            localCoordinates
          }, hit, nativeEvent);

          this._layerCallbacks[hit.layerId](mouseoverEvent);
        }
      }
    }

    class MouseoutHandler$1 extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'mouseout',
          eventName: 'mousemove'
        });

        this._previousMouseoverHits = {};
        this._currentMouseoverHits = {};
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitId = getHitId(hit);

          this._currentMouseoverHits[hitId] = hit;
        }

        for (const hitId in this._previousMouseoverHits) {
          if (!(hitId in this._currentMouseoverHits)) {
            const hit = this._previousMouseoverHits[hitId];
            this._fireCallback(hit, screenCoordinates, nativeEvent);
          }
        }

        this._previousMouseoverHits = this._currentMouseoverHits;
        this._currentMouseoverHits = {};
      }

      _fireCallback (hit, screenCoordinates, nativeEvent) {
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        if (hitIsMark(hit)) {
          const mouseoutEvent = createMarkEvent('mouseout', {
            screenCoordinates,
            localCoordinates
          }, hit, nativeEvent);

          this._markCallbacks[hit.markId](mouseoutEvent);
        }

        if (hitIsInLayer(hit)) {
          const mouseoutEvent = createLayerEvent('mouseout', {
            screenCoordinates,
            localCoordinates
          }, hit, nativeEvent);

          this._layerCallbacks[hit.layerId](mouseoutEvent);
        }
      }
    }

    class MousedownHandler$1 extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'mousedown',
          eventName: 'mousedown'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];

          if (hitIsMark(hit)) {
            const mousedownEvent = createMarkEvent('mousedown', {
              screenCoordinates,
              localCoordinates
            }, hit, nativeEvent);

            this._markCallbacks[hit.markId](mousedownEvent);
          }

          if (hitIsInLayer(hit)) {
            const mousedownEvent = createLayerEvent('mousedown', {
              screenCoordinates,
              localCoordinates
            }, hit, nativeEvent);

            this._layerCallbacks[hit.layerId](mousedownEvent);
          }
        }
      }
    }

    class MouseupHandler$1 extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'mouseup',
          eventName: 'mouseup'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];

          if (hitIsMark(hit)) {
            const mouseupEvent = createMarkEvent('mouseup', {
              screenCoordinates,
              localCoordinates
            }, hit, nativeEvent);

            this._markCallbacks[hit.markId](mouseupEvent);
          }

          if (hitIsInLayer(hit)) {
            const mouseupEvent = createLayerEvent('mouseup', {
              screenCoordinates,
              localCoordinates
            }, hit, nativeEvent);

            this._layerCallbacks[hit.layerId](mouseupEvent);
          }
        }
      }
    }

    class MousedragHandler extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'mousedrag',
          eventName: ['mousedown', 'mousemove', 'mouseup']
        });

        this._currentHits = {};
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (nativeEvent.eventName === 'mousedown') {
          this._handleMousedown(screenCoordinates, nativeEvent);
        }

        if (nativeEvent.eventName === 'mousemove') {
          this._handleMousemove(screenCoordinates, nativeEvent);
        }

        if (nativeEvent.eventName === 'mouseup') {
          this._handleMouseup(screenCoordinates, nativeEvent);
        }
      }

      _handleMousedown (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitId = getHitId(hit);

          this._currentHits[hitId] = hit;

          this._fireCallback(hit, screenCoordinates, nativeEvent, 'start');
        }
      }

      _handleMousemove (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        for (const hitId in this._currentHits) {
          const hit = this._currentHits[hitId];
          this._fireCallback(hit, screenCoordinates, nativeEvent, 'drag');
        }
      }

      _handleMouseup (screenCoordinates, nativeEvent) {
        for (const hitId in this._currentHits) {
          const hit = this._currentHits[hitId];
          this._fireCallback(hit, screenCoordinates, nativeEvent, 'end');
        }

        this._currentHits = {};
      }

      _fireCallback (hit, screenCoordinates, nativeEvent, dragType) {
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        if (hitIsMark(hit)) {
          const mousedragEvent = createMarkEvent('mousedrag', {
            screenCoordinates,
            localCoordinates,
            dragType
          }, hit, nativeEvent);

          this._markCallbacks[hit.markId](mousedragEvent);
        }

        if (hitIsInLayer(hit)) {
          const mousedragEvent = createLayerEvent('mousedrag', {
            screenCoordinates,
            localCoordinates,
            dragType
          }, hit, nativeEvent);

          this._layerCallbacks[hit.layerId](mousedragEvent);
        }
      }
    }

    var MarkInteractionHandlers$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ClickHandler: ClickHandler$1,
        MouseoverHandler: MouseoverHandler$1,
        MouseoutHandler: MouseoutHandler$1,
        MousedownHandler: MousedownHandler$1,
        MouseupHandler: MouseupHandler$1,
        MousedragHandler: MousedragHandler
    });

    class SectionInteractionHandler extends BaseInteractionHandler {
      constructor (interactionManager, options) {
        super(interactionManager, options);
        this._callback = undefined;
      }

      addInteraction (callback) {
        this._addEventListener();
        this._callback = callback;
      }

      hasInteraction () {
        return this._callback !== undefined
      }

      removeInteraction () {
        if (this._callback) {
          this._callback = undefined;
          this._removeEventListener();
        }
      }

      getId () {
        return `${this.id()}-section-${this._interactionName}`
      }
    }

    // Taken from:
    // https://stackoverflow.com/a/37474225/7237112

    function getScrollLineHeight () {
      var r;
      var iframe = document.createElement('iframe');
      iframe.src = '#';
      document.body.appendChild(iframe);
      var iwin = iframe.contentWindow;
      var idoc = iwin.document;
      idoc.open();
      idoc.write('<!DOCTYPE html><html><head></head><body><span>a</span></body></html>');
      idoc.close();
      var span = idoc.body.firstElementChild;
      r = span.offsetHeight;
      document.body.removeChild(iframe);

      return r
    }

    class WheelHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'wheel',
          eventName: 'wheel'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        nativeEvent.preventDefault();
        nativeEvent.stopPropagation();

        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);
          const delta = getDelta(nativeEvent);

          const wheelEvent = createSectionEvent('wheel', {
            screenCoordinates,
            localCoordinates,
            delta
          }, nativeEvent);

          this._callback(wheelEvent);
        }
      }
    }

    let scrollLineHeight;

    function getDelta (nativeEvent) {
      let delta;

      // Legacy
      // IE pixels
      if ('wheelDelta' in nativeEvent && nativeEvent.wheelDelta !== 0) {
        delta = -nativeEvent.wheelDelta;
      }

      // Mozilla
      if ('detail' in nativeEvent && nativeEvent.detail !== 0) {
        delta = -nativeEvent.detail;
      }

      // Most other cases
      if ('deltaY' in nativeEvent && nativeEvent.deltaY !== 0) {
        delta = -nativeEvent.deltaY;
      }

      if (!scrollLineHeight) {
        scrollLineHeight = getScrollLineHeight();
      }

      return delta * (nativeEvent.deltaMode ? scrollLineHeight : 1) / 500
    }

    class ClickHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'click',
          eventName: 'click'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

          const clickEvent = createSectionEvent('click', {
            screenCoordinates,
            localCoordinates
          }, nativeEvent);

          this._callback(clickEvent);
        }
      }
    }

    class MousedownHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'mousedown',
          eventName: 'mousedown'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

          const mousedownEvent = createSectionEvent('mousedown', {
            screenCoordinates,
            localCoordinates
          }, nativeEvent);

          this._callback(mousedownEvent);
        }
      }
    }

    class MouseupHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'mouseup',
          eventName: 'mouseup'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

          const mouseupEvent = createSectionEvent('mouseup', {
            screenCoordinates,
            localCoordinates
          }, nativeEvent);

          this._callback(mouseupEvent);
        }
      }
    }

    class MouseoverHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'mouseover',
          eventName: 'mousemove'
        });

        this._mouseCurrentlyOverSection = false;
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          if (!this._mouseCurrentlyOverSection) {
            const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

            const mousedownEvent = createSectionEvent('mouseover', {
              screenCoordinates,
              localCoordinates
            }, nativeEvent);

            this._callback(mousedownEvent);
            this._mouseCurrentlyOverSection = true;
          }
        } else {
          if (this._mouseCurrentlyOverSection) {
            this._mouseCurrentlyOverSection = false;
          }
        }
      }
    }

    class MouseoutHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'mouseout',
          eventName: 'mousemove'
        });

        this._mouseCurrentlyOverSection = false;
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          if (!this._mouseCurrentlyOverSection) {
            this._mouseCurrentlyOverSection = true;
          }
        } else {
          if (this._mouseCurrentlyOverSection) {
            const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

            const mouseoutEvent = createSectionEvent('mouseout', {
              screenCoordinates,
              localCoordinates
            }, nativeEvent);

            this._callback(mouseoutEvent);
            this._mouseCurrentlyOverSection = false;
          }
        }
      }
    }

    class MousemoveHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'mouseover',
          eventName: 'mousemove'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

          const mousemoveEvent = createSectionEvent('mousemove', {
            screenCoordinates,
            localCoordinates
          }, nativeEvent);

          this._callback(mousemoveEvent);
        }
      }
    }

    var SectionInteractionHandlers$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        WheelHandler: WheelHandler,
        ClickHandler: ClickHandler,
        MousedownHandler: MousedownHandler,
        MouseupHandler: MouseupHandler,
        MouseoverHandler: MouseoverHandler,
        MouseoutHandler: MouseoutHandler,
        MousemoveHandler: MousemoveHandler
    });

    class MouseInteractionManager extends BaseInteractionManager {
      constructor () {
        super();

        this._markInteractionInterface = new MarkInteractionInterface(this, MarkInteractionHandlers$1);
        this._sectionInteractionInterface = new SectionInteractionInterface(this, SectionInteractionHandlers$1);
      }
    }

    function numberOfTouches (screenCoordinates) {
      if (screenCoordinates.constructor === Object) return 1

      return screenCoordinates.length
    }

    class TouchdownHandler$1 extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'touchdown',
          eventName: 'touchstart'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (numberOfTouches(screenCoordinates) !== 1) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];

          if (hitIsMark(hit)) {
            const touchdownEvent = createMarkEvent('touchdown', {
              screenCoordinates,
              localCoordinates
            }, hit, nativeEvent);

            this._markCallbacks[hit.markId](touchdownEvent);
          }

          if (hitIsInLayer(hit)) {
            const touchdownEvent = createLayerEvent('touchdown', {
              screenCoordinates,
              localCoordinates
            }, hit, nativeEvent);

            this._layerCallbacks[hit.layerId](touchdownEvent);
          }
        }
      }
    }

    class TouchupHandler$1 extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'touchup',
          eventName: ['touchend', 'touchcancel']
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (numberOfTouches(screenCoordinates) !== 1) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];

          if (hitIsMark(hit)) {
            const touchupEvent = createMarkEvent('touchup', {
              screenCoordinates,
              localCoordinates
            }, hit, nativeEvent);

            this._markCallbacks[hit.markId](touchupEvent);
          }

          if (hitIsInLayer(hit)) {
            const touchupEvent = createLayerEvent('touchup', {
              screenCoordinates,
              localCoordinates
            }, hit, nativeEvent);

            this._layerCallbacks[hit.layerId](touchupEvent);
          }
        }
      }
    }

    class TouchoverHandler$1 extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'touchover',
          eventName: ['touchstart', 'touchmove']
        });

        this._previousHits = {};
        this._currentHits = {};
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (numberOfTouches(screenCoordinates) !== 1) {
          return
        }

        if (nativeEvent.eventName === 'touchstart') {
          this._handleTouchstart(screenCoordinates, nativeEvent);
        }

        if (nativeEvent.eventName === 'touchmove') {
          this._handleTouchmove(screenCoordinates, nativeEvent);
        }
      }

      _handleTouchstart (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitId = getHitId(hit);

          this._previousHits[hitId] = true;
        }
      }

      _handleTouchmove (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitId = getHitId(hit);

          this._currentHits[hitId] = true;

          if (!(hitId in this._previousHits)) {
            this._fireCallback(hit, screenCoordinates, nativeEvent);
          }
        }

        this._previousHits = this._currentHits;
        this._currentHits = {};
      }

      _fireCallback (hit, screenCoordinates, nativeEvent) {
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        if (hitIsMark(hit)) {
          const touchoverEvent = createMarkEvent('touchover', {
            screenCoordinates,
            localCoordinates
          }, hit, nativeEvent);

          this._markCallbacks[hit.markId](touchoverEvent);
        }

        if (hitIsInLayer(hit)) {
          const touchoverEvent = createLayerEvent('touchover', {
            screenCoordinates,
            localCoordinates
          }, hit, nativeEvent);

          this._layerCallbacks[hit.layerId](touchoverEvent);
        }
      }
    }

    class TouchoutHandler$1 extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'touchout',
          eventName: ['touchstart', 'touchmove', 'touchend']
        });

        this._previousHits = {};
        this._currentHits = {};
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (numberOfTouches(screenCoordinates) !== 1) {
          return
        }

        if (nativeEvent.eventName === 'touchstart') {
          this._handleTouchstart(screenCoordinates, nativeEvent);
        }

        if (nativeEvent.eventName === 'touchmove') {
          this._handleTouchmove(screenCoordinates, nativeEvent);
        }

        if (nativeEvent.eventName === 'touchend') {
          this._handleTouchend();
        }
      }

      _handleTouchstart (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitId = getHitId(hit);

          this._previousHits[hitId] = hit;
        }
      }

      _handleTouchmove (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitId = getHitId(hit);

          this._currentHits[hitId] = hit;
        }

        for (const hitId in this._previousHits) {
          if (!(hitId in this._currentHits)) {
            const hit = this._previousHits[hitId];
            this._fireCallback(hit, screenCoordinates, nativeEvent);
          }
        }

        this._previousHits = this._currentHits;
        this._currentHits = {};
      }

      _handleTouchend () {
        this._previousHits = {};
        this._currentHits = {};
      }

      _fireCallback (hit, screenCoordinates, nativeEvent) {
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        if (hitIsMark(hit)) {
          const touchoutEvent = createMarkEvent('touchout', {
            screenCoordinates,
            localCoordinates
          }, hit, nativeEvent);

          this._markCallbacks[hit.markId](touchoutEvent);
        }

        if (hitIsInLayer(hit)) {
          const touchoutEvent = createLayerEvent('touchout', {
            screenCoordinates,
            localCoordinates
          }, hit, nativeEvent);

          this._layerCallbacks[hit.layerId](touchoutEvent);
        }
      }
    }

    class TouchdragHandler extends MarkInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'touchdrag',
          eventName: ['touchstart', 'touchmove', 'touchend']
        });

        this._currentHits = {};
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (numberOfTouches(screenCoordinates) !== 1) {
          return
        }

        if (nativeEvent.eventName === 'touchstart') {
          this._handleTouchstart(screenCoordinates, nativeEvent);
        }

        if (nativeEvent.eventName === 'touchmove') {
          this._handleTouchmove(screenCoordinates, nativeEvent);
        }

        if (nativeEvent.eventName === 'touchend') {
          this._handleTouchend(screenCoordinates, nativeEvent);
        }
      }

      _handleTouchstart (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        const spatialIndex = this._spatialIndex;
        const hits = spatialIndex.queryMouseCoordinates(screenCoordinates);

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitId = getHitId(hit);

          this._currentHits[hitId] = hit;

          this._fireCallback(hit, screenCoordinates, nativeEvent, 'start');
        }
      }

      _handleTouchmove (screenCoordinates, nativeEvent) {
        if (!coordinatesAreInsideSection(screenCoordinates, this.section())) {
          return
        }

        for (const hitId in this._currentHits) {
          const hit = this._currentHits[hitId];
          this._fireCallback(hit, screenCoordinates, nativeEvent, 'drag');
        }
      }

      _handleTouchend (screenCoordinates, nativeEvent) {
        for (const hitId in this._currentHits) {
          const hit = this._currentHits[hitId];
          this._fireCallback(hit, screenCoordinates, nativeEvent, 'end');
        }

        this._currentHits = {};
      }

      _fireCallback (hit, screenCoordinates, nativeEvent, dragType) {
        const localCoordinates = getLocalCoordinates(screenCoordinates, this.interactionManager());

        if (hitIsMark(hit)) {
          const touchdragEvent = createMarkEvent('touchdrag', {
            screenCoordinates,
            localCoordinates,
            dragType
          }, hit, nativeEvent);

          this._markCallbacks[hit.markId](touchdragEvent);
        }

        if (hitIsInLayer(hit)) {
          const touchdragEvent = createLayerEvent('touchdrag', {
            screenCoordinates,
            localCoordinates,
            dragType
          }, hit, nativeEvent);

          this._layerCallbacks[hit.layerId](touchdragEvent);
        }
      }
    }

    var MarkInteractionHandlers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        TouchdownHandler: TouchdownHandler$1,
        TouchupHandler: TouchupHandler$1,
        TouchoverHandler: TouchoverHandler$1,
        TouchoutHandler: TouchoutHandler$1,
        TouchdragHandler: TouchdragHandler
    });

    class TouchdownHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'touchdown',
          eventName: 'touchstart'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (numberOfTouches(screenCoordinates) !== 1) {
          return
        }

        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

          const touchdownEvent = createSectionEvent('touchdown', {
            screenCoordinates,
            localCoordinates
          }, nativeEvent);

          this._callback(touchdownEvent);
        }
      }
    }

    class TouchmoveHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'touchmove',
          eventName: 'touchmove'
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (numberOfTouches(screenCoordinates) !== 1) {
          return
        }

        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

          const touchmoveEvent = createSectionEvent('touchmove', {
            screenCoordinates,
            localCoordinates
          }, nativeEvent);

          this._callback(touchmoveEvent);
        }
      }
    }

    class TouchupHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'touchup',
          eventName: ['touchend', 'touchcancel']
        });
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (numberOfTouches(screenCoordinates) !== 1) {
          return
        }

        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

          const touchupEvent = createSectionEvent('touchup', {
            screenCoordinates,
            localCoordinates
          }, nativeEvent);

          this._callback(touchupEvent);
        }
      }
    }

    class TouchoverHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'touchover',
          eventName: ['touchstart', 'touchmove']
        });

        this._fingerCurrentlyOverSection = false;
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (numberOfTouches(screenCoordinates) !== 1) {
          return
        }

        if (nativeEvent.eventName === 'touchstart') {
          this._handleTouchstart(screenCoordinates, nativeEvent);
        }

        if (nativeEvent.eventName === 'touchmove') {
          this._handleTouchmove(screenCoordinates, nativeEvent);
        }
      }

      _handleTouchstart (screenCoordinates, nativeEvent) {
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          this._fingerCurrentlyOverSection = true;
        }
      }

      _handleTouchmove (screenCoordinates, nativeEvent) {
        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          if (!this._fingerCurrentlyOverSection) {
            const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

            const touchoverEvent = createSectionEvent('touchover', {
              screenCoordinates,
              localCoordinates
            }, nativeEvent);

            this._callback(touchoverEvent);
            this._fingerCurrentlyOverSection = true;
          }
        } else {
          if (this._fingerCurrentlyOverSection) {
            this._fingerCurrentlyOverSection = false;
          }
        }
      }
    }

    class TouchoutHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'touchout',
          eventName: ['touchstart', 'touchmove', 'touchend']
        });

        this._fingerCurrentlyOverSection = false;
      }

      _handleEvent (screenCoordinates, nativeEvent) {
        if (numberOfTouches(screenCoordinates) !== 1) {
          return
        }

        if (nativeEvent.eventName === 'touchstart') {
          this._handleTouchstart(screenCoordinates, nativeEvent);
        }

        if (nativeEvent.eventName === 'touchmove') {
          this._handleTouchmove(screenCoordinates, nativeEvent);
        }

        if (nativeEvent.eventName === 'touchend') {
          this._handleTouchend();
        }
      }

      _handleTouchstart (screenCoordinates, nativeEvent) {
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          this._fingerCurrentlyOverSection = true;
        }
      }

      _handleTouchmove (screenCoordinates, nativeEvent) {
        const interactionManager = this.interactionManager();
        const section = this.section();

        if (coordinatesAreInsideSection(screenCoordinates, section)) {
          if (!this._fingerCurrentlyOverSection) {
            this._fingerCurrentlyOverSection = true;
          }
        } else {
          if (this._fingerCurrentlyOverSection) {
            const localCoordinates = getLocalCoordinates(screenCoordinates, interactionManager);

            const touchoutEvent = createSectionEvent('touchout', {
              screenCoordinates,
              localCoordinates
            }, nativeEvent);

            this._callback(touchoutEvent);
            this._fingerCurrentlyOverSection = false;
          }
        }
      }

      _handleTouchend () {
        this._fingerCurrentlyOverSection = false;
      }
    }

    class PinchHandler extends SectionInteractionHandler {
      constructor (interactionManager) {
        super(interactionManager, {
          interactionName: 'pinch',
          eventName: ['touchstart', 'touchmove', 'touchend']
        });

        this._previousTouchDistance = undefined;
      }

      _handleEvent (screenCoordinatesArray, nativeEvent) {
        if (nativeEvent.type === 'touchstart') {
          this._handleTouchstart(screenCoordinatesArray, nativeEvent);
        }

        if (nativeEvent.type === 'touchmove') {
          this._handleTouchmove(screenCoordinatesArray, nativeEvent);
        }

        if (nativeEvent.type === 'touchend') {
          this._handleTouchend(screenCoordinatesArray, nativeEvent);
        }
      }

      _handleTouchstart (screenCoordinatesArray, nativeEvent) {
        if (numberOfTouches(screenCoordinatesArray) !== 2) {
          return
        }

        const section = this.section();

        if (allCoordinatesAreInsideSection(screenCoordinatesArray, section)) {
          this._previousTouchDistance = getDistance(screenCoordinatesArray);
        }
      }

      _handleTouchmove (screenCoordinatesArray, nativeEvent) {
        if (numberOfTouches(screenCoordinatesArray) !== 2) {
          return
        }

        if (this._previousTouchDistance === undefined) return

        const section = this.section();

        if (allCoordinatesAreInsideSection(screenCoordinatesArray, section)) {
          const sectionHeight = section.maxY - section.minY;

          const center = getCenter(screenCoordinatesArray);

          const touchDistance = getDistance(screenCoordinatesArray);
          const touchDelta = this._previousTouchDistance - touchDistance;
          const relativeTouchDelta = touchDelta / sectionHeight;

          this._previousTouchDistance = touchDistance;
          this._fireCallback(screenCoordinatesArray, nativeEvent, relativeTouchDelta, center);
        }
      }

      _handleTouchend (screenCoordinatesArray, nativeEvent) {
        this._previousTouchDistance = undefined;
      }

      _fireCallback (screenCoordinatesArray, nativeEvent, delta, center) {
        const screenCenter = center;
        const localCenter = getLocalCoordinates(screenCenter, this.interactionManager());
        const screenCoordinates = screenCoordinatesArray;
        const localCoordinates = screenCoordinatesArray.map(screenCoordinates => {
          return getLocalCoordinates(screenCoordinates, this.interactionManager())
        });

        const pinchEvent = createSectionEvent('pinch', {
          screenCenter,
          localCenter,
          screenCoordinates,
          localCoordinates,
          delta
        }, nativeEvent);

        this._callback(pinchEvent);
      }
    }

    function allCoordinatesAreInsideSection (screenCoordinatesArray, section) {
      return screenCoordinatesArray.every(screenCoordinates => {
        return coordinatesAreInsideSection(screenCoordinates, section)
      })
    }

    function getDistance (screenCoordinatesArray) {
      const [coords1, coords2] = screenCoordinatesArray;
      return Math.sqrt((coords2.x - coords1.x) ** 2 + (coords2.y - coords1.y) ** 2)
    }

    function getCenter (screenCoordinatesArray) {
      const [coords1, coords2] = screenCoordinatesArray;
      return { x: (coords2.x + coords1.x) / 2, y: (coords2.y + coords1.y) / 2 }
    }

    var SectionInteractionHandlers = /*#__PURE__*/Object.freeze({
        __proto__: null,
        TouchdownHandler: TouchdownHandler,
        TouchmoveHandler: TouchmoveHandler,
        TouchupHandler: TouchupHandler,
        TouchoverHandler: TouchoverHandler,
        TouchoutHandler: TouchoutHandler,
        PinchHandler: PinchHandler
    });

    class TouchInteractionManager extends BaseInteractionManager {
      constructor () {
        super();

        this._markInteractionInterface = new MarkInteractionInterface(this, MarkInteractionHandlers);
        this._sectionInteractionInterface = new SectionInteractionInterface(this, SectionInteractionHandlers);
      }
    }

    function bboxPoint (point) {
      return {
        x: [point[0], point[0]],
        y: [point[1], point[1]]
      }
    }

    function indexPoint (markData) {
      const pointAttributes = markData.attributes;

      const bbox = bboxPoint(pointAttributes.pixelGeometry.coordinates);
      const item = createItemFromBbox(bbox);

      item.attributes = pointAttributes;
      item.markType = 'Point';
      item.markId = markData.markId;

      return item
    }

    function indexPointLayer ({ layerAttributes, keyArray, layerId }) {
      const items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        const pointAttributes = getPointAttributes(layerAttributes, key);
        const bbox = bboxPoint(pointAttributes.pixelGeometry.coordinates);
        const item = createItemFromBbox(bbox);

        item.key = key;
        item.index = i;
        item.attributes = pointAttributes;
        item.markType = 'Point';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function getPointAttributes (layerAttributes, key) {
      return {
        pixelGeometry: layerAttributes.pixelGeometryObject[key],
        radius: layerAttributes.radiusObject[key]
      }
    }

    function indexRectangle (markData) {
      const rectangleAttributes = markData.attributes;

      const centroid = calculateCentroid$1(rectangleAttributes.screenGeometry);
      const bbox = bboxPoint(centroid);
      const item = createItemFromBbox(bbox);

      item.attributes = rectangleAttributes;
      item.markType = 'Rectangle';
      item.markId = markData.markId;

      return item
    }

    function indexRectangleLayer ({ layerAttributes, keyArray, layerId }) {
      const items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        const rectangleAttributes = getRectangleAttributes(layerAttributes, key);

        const centroid = calculateCentroid$1(rectangleAttributes.screenGeometry);
        const bbox = bboxPoint(centroid);
        const item = createItemFromBbox(bbox);

        item.key = key;
        item.index = i;
        item.attributes = rectangleAttributes;
        item.markType = 'Rectangle';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function getRectangleAttributes (layerAttributes, key) {
      return { screenGeometry: layerAttributes.screenGeometryObject[key] }
    }

    function indexPolygon (markData) {
      const polygonAttributes = markData.attributes;

      const centroid = calculateCentroid$1(polygonAttributes.screenGeometry);
      const bbox = bboxPoint(centroid);
      const item = createItemFromBbox(bbox);

      item.attributes = polygonAttributes;
      item.markType = 'Polygon';
      item.markId = markData.markId;

      return item
    }

    function indexPolygonLayer ({ layerAttributes, keyArray, layerId }) {
      const items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        const polygonAttributes = getPolygonAttributes(layerAttributes, key);

        const centroid = calculateCentroid$1(polygonAttributes.screenGeometry);
        const bbox = bboxPoint(centroid);
        const item = createItemFromBbox(bbox);

        item.key = key;
        item.index = i;
        item.attributes = polygonAttributes;
        item.markType = 'Polygon';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function getPolygonAttributes (layerAttributes, key) {
      return { screenGeometry: layerAttributes.screenGeometryObject[key] }
    }

    function indexLine (markData) {
      const lineAttributes = markData.attributes;

      const centroid = calculateCentroid$1(lineAttributes.pixelGeometry);
      const bbox = bboxPoint(centroid);
      const item = createItemFromBbox(bbox);

      item.attributes = lineAttributes;
      item.markType = 'Line';
      item.markId = markData.markId;

      return item
    }

    function indexLineLayer ({ layerAttributes, keyArray, layerId }) {
      const items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        const lineAttributes = getLineAttributes(layerAttributes, key);

        const centroid = calculateCentroid$1(lineAttributes.screenGeometry);
        const bbox = bboxPoint(centroid);
        const item = createItemFromBbox(bbox);

        item.key = key;
        item.index = i;
        item.attributes = lineAttributes;
        item.markType = 'Line';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function getLineAttributes (layerAttributes, key) {
      return { screenGeometry: layerAttributes.pixelGeometryObject[key] }
    }

    function indexArea (markData) {
      const areaAttributes = markData.attributes;

      const centroid = calculateCentroid$1(areaAttributes.screenGeometry);
      const bbox = bboxPoint(centroid);
      const item = createItemFromBbox(bbox);

      item.attributes = areaAttributes;
      item.markType = 'Area';
      item.markId = markData.markId;

      return item
    }

    function indexAreaLayer ({ layerAttributes, keyArray, layerId }) {
      const items = [];

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        const areaAttributes = getAreaAttributes(layerAttributes, key);

        const centroid = calculateCentroid$1(areaAttributes.screenGeometry);
        const bbox = bboxPoint(centroid);
        const item = createItemFromBbox(bbox);

        item.key = key;
        item.index = i;
        item.attributes = areaAttributes;
        item.markType = 'Area';
        item.layerId = layerId;

        items.push(item);
      }

      return items
    }

    function getAreaAttributes (layerAttributes, key) {
      return { screenGeometry: layerAttributes.screenGeometryObject[key] }
    }

    const markIndexing = {
      Point: indexPoint,
      Rectangle: indexRectangle,
      Polygon: indexPolygon,
      Line: indexLine,
      Label: indexPoint,
      Area: indexArea
    };

    const layerIndexing = {
      Point: indexPointLayer,
      Rectangle: indexRectangleLayer,
      Polygon: indexPolygonLayer,
      Line: indexLineLayer,
      Label: indexPointLayer,
      Area: indexAreaLayer
    };

    class SelectManager {
      constructor () {
        this._selectableMarks = {};
        this._selectableLayers = {};

        this._markCallbacks = {};
        this._layerCallbacks = {};

        this._previousSelection = {};
        this._currentSelection = {};

        const getMark = function (markId) {
          return this._selectableMarks[markId]
        };

        const getLayer = function (layerId) {
          return this._selectableLayers[layerId]
        };

        this._spatialIndex = new SpatialIndex(this, getMark, getLayer);

        this._selectPolygon = { start: undefined, points: [] };
      }

      // Loading/indexing
      loadMark (markType, markData, callbacks) {
        const indexingFunction = markIndexing[markType];
        const indexableMark = indexingFunction(markData);

        const markId = markData.markId;

        this._selectableMarks[markId] = indexableMark;
        this._markCallbacks[markId] = callbacks;

        this._spatialIndex.indexMark(markId);
      }

      markIsLoaded (markId) {
        return markId in this._selectableMarks
      }

      removeMark (markId) {
        this._spatialIndex.unindexMark(markId);

        delete this._selectableMarks[markId];
        delete this._markCallbacks[markId];
      }

      loadLayer (layerType, layerData, callbacks) {
        const indexingFunction = layerIndexing[layerType];
        const indexableLayer = indexingFunction(layerData);

        const layerId = layerData.layerId;

        this._selectableLayers[layerId] = indexableLayer;
        this._layerCallbacks[layerId] = callbacks;

        this._spatialIndex.indexLayer(layerId);
      }

      layerIsLoaded (layerId) {
        return layerId in this._selectableLayers
      }

      removeLayer (layerId) {
        this._spatialIndex.unindexLayer(layerId);

        delete this._selectableLayers[layerId];
        delete this._layerCallbacks[layerId];
      }

      // Rectangle
      selectRectangle (rectangle) {
        const hits = this._spatialIndex.queryBoundingBox(rectangleToRBushBbox(rectangle));

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitId = getHitId(hit);

          this._currentSelection[hitId] = hit;

          this._fireSelectCallback(hit);
        }
      }

      updateSelectRectangle (rectangle) {
        this._previousSelection = this._currentSelection;
        this._currentSelection = {};

        const hits = this._spatialIndex.queryBoundingBox(rectangleToRBushBbox(rectangle));

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitId = getHitId(hit);

          this._currentSelection[hitId] = hit;

          if (!(hitId in this._previousSelection)) {
            this._fireSelectCallback(hit);
          }
        }

        for (const hitId in this._previousSelection) {
          if (!(hitId in this._currentSelection)) {
            const hit = this._previousSelection[hitId];

            this._fireDeselectCallback(hit);
          }
        }
      }

      resetSelectRectangle () {
        for (const hitId in this._currentSelection) {
          const hit = this._currentSelection[hitId];

          this._fireDeselectCallback(hit);
        }

        this._previousSelection = {};
        this._currentSelection = {};
      }

      // Polygon
      startSelectPolygon (startCoordinates) {
        this._selectPolygon.start = parseCoordinates(startCoordinates);
      }

      addPointToSelectPolygon (coordinates) {
        this._selectPolygon.points.push(parseCoordinates(coordinates));

        if (this._selectPolygon.points.length > 1) {
          const lastThreePointsPolygon = this._getLastThreePointsPolygon();
          const bbox = calculateBboxGeometry(lastThreePointsPolygon);

          const hits = this._spatialIndex.queryBoundingBox(bboxToRBushBbox(bbox));

          for (let i = 0; i < hits.length; i++) {
            const hit = hits[i];
            const hitCentroid = [hit.minX, hit.minY];

            if (pointInPolygon(hitCentroid, lastThreePointsPolygon)) {
              const hitId = getHitId(hit);

              if (hitId in this._currentSelection) {
                this._fireDeselectCallback(hit);
                delete this._currentSelection[hitId];
              } else {
                this._fireSelectCallback(hit);
                this._currentSelection[hitId] = hit;
              }
            }
          }
        }
      }

      moveSelectPolygon (_delta) {
        this._previousSelection = this._currentSelection;
        this._currentSelection = {};

        const delta = parseCoordinates(_delta);

        const start = this._selectPolygon.start;
        const points = this._selectPolygon.points;

        this._selectPolygon.start = [start[0] + delta[0], start[1] + delta[1]];
        this._selectPolygon.points = points.map(point => [point[0] + delta[0], point[1] + delta[1]]);

        const polygon = this.getSelectPolygon();
        const bbox = calculateBboxGeometry(polygon);

        const hits = this._spatialIndex.queryBoundingBox(bboxToRBushBbox(bbox));

        for (let i = 0; i < hits.length; i++) {
          const hit = hits[i];
          const hitCentroid = [hit.minX, hit.minY];

          if (pointInPolygon(hitCentroid, polygon)) {
            const hitId = getHitId(hit);

            this._currentSelection[hitId] = hit;

            if (!(hitId in this._previousSelection)) {
              this._fireSelectCallback(hit);
            }
          }
        }

        for (const hitId in this._previousSelection) {
          if (!(hitId in this._currentSelection)) {
            const hit = this._previousSelection[hitId];

            this._fireDeselectCallback(hit);
          }
        }
      }

      getSelectPolygon () {
        if (this._selectPolygon.start) {
          return {
            type: 'Polygon',
            coordinates: [[
              this._selectPolygon.start,
              ...this._selectPolygon.points,
              this._selectPolygon.start
            ]]
          }
        }
      }

      resetSelectPolygon () {
        for (const hitId in this._currentSelection) {
          const hit = this._currentSelection[hitId];

          this._fireDeselectCallback(hit);
        }

        this._selectPolygon = { start: undefined, points: [] };
        this._currentSelection = {};
      }

      _fireSelectCallback (hit) {
        if (hitIsMark(hit)) {
          const selectEvent = createSelectMarkEvent('select', hit);
          const callback = this._markCallbacks[hit.markId].onSelect;

          if (callback) callback(selectEvent);
        }

        if (hitIsInLayer(hit)) {
          const selectEvent = createSelectLayerEvent('select', hit);
          const callback = this._layerCallbacks[hit.layerId].onSelect;

          if (callback) callback(selectEvent);
        }
      }

      _fireDeselectCallback (hit) {
        if (hitIsMark(hit)) {
          const deselectEvent = createSelectMarkEvent('deselect', hit);
          const callback = this._markCallbacks[hit.markId].onDeselect;

          if (callback) callback(deselectEvent);
        }

        if (hitIsInLayer(hit)) {
          const deselectEvent = createSelectLayerEvent('deselect', hit);
          const callback = this._layerCallbacks[hit.layerId].onDeselect;

          if (callback) callback(deselectEvent);
        }
      }

      _getLastThreePointsPolygon () {
        const points = this._selectPolygon.points;
        const lastPointIndex = points.length - 1;
        const start = this._selectPolygon.start;

        return {
          type: 'Polygon',
          coordinates: [
            [start, points[lastPointIndex - 1], points[lastPointIndex], start]
          ]
        }
      }
    }

    function rectangleToRBushBbox (rectangle) {
      return {
        minX: Math.min(rectangle.x1, rectangle.x2),
        maxX: Math.max(rectangle.x1, rectangle.x2),
        minY: Math.min(rectangle.y1, rectangle.y2),
        maxY: Math.max(rectangle.y1, rectangle.y2)
      }
    }

    function parseCoordinates (coordinates) {
      if (is2dArray(coordinates)) return coordinates
      if (isXYObject(coordinates)) return [coordinates.x, coordinates.y]

      throw new Error(`Invalid input: ${coordinates}`)
    }

    function is2dArray (coordinates) {
      return coordinates.constructor === Array &&
        coordinates.length === 2 &&
        coordinates.every(c => c && c.constructor === Number)
    }

    function isXYObject (coordinates) {
      return 'x' in coordinates && 'y' in coordinates &&
        coordinates.x.constructor === Number &&
        coordinates.y.constructor === Number
    }

    function bboxToRBushBbox (bbox) {
      return {
        minX: Math.min(...bbox.x),
        maxX: Math.max(...bbox.x),
        minY: Math.min(...bbox.y),
        maxY: Math.max(...bbox.y)
      }
    }

    class InteractionManager {
      constructor () {
        if (primaryInput === 'mouse') {
          this._mouseInteractionManager = new MouseInteractionManager();
        }

        if (primaryInput === 'touch') {
          this._touchInteractionManager = new TouchInteractionManager();
        }

        this._selectManager = new SelectManager();
      }

      // Initialization
      setId (id) {
        this._forEachManager(manager => { manager.setId(id); });
      }

      linkEventManager (eventManager) {
        if (this._mouseInteractionManager) {
          this._mouseInteractionManager.linkEventManager(eventManager.mouse());
        }

        if (this._touchInteractionManager) {
          this._touchInteractionManager.linkEventManager(eventManager.touch());
        }
      }

      // Section context loading
      loadSection (sectionContext) {
        this._forEachManager(manager => { manager.loadSection(sectionContext); });
      }

      mouse () {
        return this._mouseInteractionManager
      }

      touch () {
        return this._touchInteractionManager
      }

      select () {
        return this._selectManager
      }

      _forEachManager (callback) {
        if (this._mouseInteractionManager) callback(this._mouseInteractionManager);
        if (this._touchInteractionManager) callback(this._touchInteractionManager);
      }
    }

    function getClipPropsNoPadding ({ x1, x2, y1, y2 }) {
      return {
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x1 - x2),
        height: Math.abs(y1 - y2)
      }
    }

    function getClipPropsPadding ({ x1, x2, y1, y2 }, padding) {
      const { left, right, top, bottom } = parsePadding(padding);

      return {
        x: Math.min(x1, x2) + left,
        y: Math.min(y1, y2) + top,
        width: Math.abs(x1 - x2) - (left + right),
        height: Math.abs(y1 - y2) - (top + bottom)
      }
    }

    /* node_modules/@snlab/florence/src/components/Core/Graphic/Graphic.svelte generated by Svelte v3.37.0 */

    const file$7 = "node_modules/@snlab/florence/src/components/Core/Graphic/Graphic.svelte";

    // (236:2) {#if clip}
    function create_if_block_2$4(ctx) {
    	let clipPath;
    	let rect;
    	let rect_levels = [/*clipPropsPadding*/ ctx[8]];
    	let rect_data = {};

    	for (let i = 0; i < rect_levels.length; i += 1) {
    		rect_data = assign(rect_data, rect_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			clipPath = svg_element("clipPath");
    			rect = svg_element("rect");
    			set_svg_attributes(rect, rect_data);
    			add_location(rect, file$7, 238, 6, 7217);
    			attr_dev(clipPath, "id", `clip-${/*graphicId*/ ctx[10]}`);
    			add_location(clipPath, file$7, 237, 4, 7175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, clipPath, anchor);
    			append_dev(clipPath, rect);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(rect, rect_data = get_spread_update(rect_levels, [dirty[0] & /*clipPropsPadding*/ 256 && /*clipPropsPadding*/ ctx[8]]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(clipPath);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(236:2) {#if clip}",
    		ctx
    	});

    	return block;
    }

    // (251:2) {#if backgroundColor}
    function create_if_block_1$4(ctx) {
    	let rect;

    	let rect_levels = [
    		{ class: "content-background" },
    		/*clipPropsPadding*/ ctx[8],
    		{ fill: /*backgroundColor*/ ctx[4] }
    	];

    	let rect_data = {};

    	for (let i = 0; i < rect_levels.length; i += 1) {
    		rect_data = assign(rect_data, rect_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			set_svg_attributes(rect, rect_data);
    			add_location(rect, file$7, 251, 4, 7483);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(rect, rect_data = get_spread_update(rect_levels, [
    				{ class: "content-background" },
    				dirty[0] & /*clipPropsPadding*/ 256 && /*clipPropsPadding*/ ctx[8],
    				dirty[0] & /*backgroundColor*/ 16 && { fill: /*backgroundColor*/ ctx[4] }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(251:2) {#if backgroundColor}",
    		ctx
    	});

    	return block;
    }

    // (259:2) {#if paddingColor}
    function create_if_block$4(ctx) {
    	let rect;
    	let rect_mask_value;

    	let rect_levels = [
    		{ class: "padding-background" },
    		{
    			mask: rect_mask_value = `url(#${/*graphicId*/ ctx[10]}-mask-padding-bg)`
    		},
    		/*clipPropsNoPadding*/ ctx[9],
    		{ fill: /*paddingColor*/ ctx[5] }
    	];

    	let rect_data = {};

    	for (let i = 0; i < rect_levels.length; i += 1) {
    		rect_data = assign(rect_data, rect_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			set_svg_attributes(rect, rect_data);
    			add_location(rect, file$7, 259, 4, 7621);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    		},
    		p: function update(ctx, dirty) {
    			set_svg_attributes(rect, rect_data = get_spread_update(rect_levels, [
    				{ class: "padding-background" },
    				{ mask: rect_mask_value },
    				dirty[0] & /*clipPropsNoPadding*/ 512 && /*clipPropsNoPadding*/ ctx[9],
    				dirty[0] & /*paddingColor*/ 32 && { fill: /*paddingColor*/ ctx[5] }
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(259:2) {#if paddingColor}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let svg;
    	let defs;
    	let mask;
    	let rect0;
    	let rect1;
    	let if_block1_anchor;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*clip*/ ctx[6] && create_if_block_2$4(ctx);
    	let rect0_levels = [/*clipPropsNoPadding*/ ctx[9], { fill: "white" }];
    	let rect0_data = {};

    	for (let i = 0; i < rect0_levels.length; i += 1) {
    		rect0_data = assign(rect0_data, rect0_levels[i]);
    	}

    	let rect1_levels = [/*clipPropsPadding*/ ctx[8], { fill: "black" }];
    	let rect1_data = {};

    	for (let i = 0; i < rect1_levels.length; i += 1) {
    		rect1_data = assign(rect1_data, rect1_levels[i]);
    	}

    	let if_block1 = /*backgroundColor*/ ctx[4] && create_if_block_1$4(ctx);
    	let if_block2 = /*paddingColor*/ ctx[5] && create_if_block$4(ctx);
    	const default_slot_template = /*#slots*/ ctx[50].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[49], null);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if (if_block0) if_block0.c();
    			defs = svg_element("defs");
    			mask = svg_element("mask");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    			if (default_slot) default_slot.c();
    			set_svg_attributes(rect0, rect0_data);
    			add_location(rect0, file$7, 245, 6, 7336);
    			set_svg_attributes(rect1, rect1_data);
    			add_location(rect1, file$7, 246, 6, 7388);
    			attr_dev(mask, "id", `${/*graphicId*/ ctx[10]}-mask-padding-bg`);
    			add_location(mask, file$7, 244, 4, 7287);
    			add_location(defs, file$7, 243, 2, 7276);
    			attr_dev(svg, "id", /*graphicId*/ ctx[10]);
    			attr_dev(svg, "width", /*width*/ ctx[1]);
    			attr_dev(svg, "height", /*height*/ ctx[2]);
    			attr_dev(svg, "viewBox", /*viewBox*/ ctx[0]);
    			attr_dev(svg, "preserveAspectRatio", /*preserveAspectRatio*/ ctx[3]);
    			add_location(svg, file$7, 227, 0, 7053);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if (if_block0) if_block0.m(svg, null);
    			append_dev(svg, defs);
    			append_dev(defs, mask);
    			append_dev(mask, rect0);
    			append_dev(mask, rect1);
    			if (if_block1) if_block1.m(svg, null);
    			append_dev(svg, if_block1_anchor);
    			if (if_block2) if_block2.m(svg, null);
    			append_dev(svg, if_block2_anchor);

    			if (default_slot) {
    				default_slot.m(svg, null);
    			}

    			/*svg_binding*/ ctx[51](svg);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*clip*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2$4(ctx);
    					if_block0.c();
    					if_block0.m(svg, defs);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			set_svg_attributes(rect0, rect0_data = get_spread_update(rect0_levels, [
    				dirty[0] & /*clipPropsNoPadding*/ 512 && /*clipPropsNoPadding*/ ctx[9],
    				{ fill: "white" }
    			]));

    			set_svg_attributes(rect1, rect1_data = get_spread_update(rect1_levels, [
    				dirty[0] & /*clipPropsPadding*/ 256 && /*clipPropsPadding*/ ctx[8],
    				{ fill: "black" }
    			]));

    			if (/*backgroundColor*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$4(ctx);
    					if_block1.c();
    					if_block1.m(svg, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*paddingColor*/ ctx[5]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$4(ctx);
    					if_block2.c();
    					if_block2.m(svg, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty[1] & /*$$scope*/ 262144) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[49], dirty, null, null);
    				}
    			}

    			if (!current || dirty[0] & /*width*/ 2) {
    				attr_dev(svg, "width", /*width*/ ctx[1]);
    			}

    			if (!current || dirty[0] & /*height*/ 4) {
    				attr_dev(svg, "height", /*height*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*viewBox*/ 1) {
    				attr_dev(svg, "viewBox", /*viewBox*/ ctx[0]);
    			}

    			if (!current || dirty[0] & /*preserveAspectRatio*/ 8) {
    				attr_dev(svg, "preserveAspectRatio", /*preserveAspectRatio*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (default_slot) default_slot.d(detaching);
    			/*svg_binding*/ ctx[51](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let idCounter$2 = 0;

    function getId$2() {
    	return "gr" + idCounter$2++;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let coordinates;
    	let clipPropsPadding;
    	let clipPropsNoPadding;
    	let $interactionManagerContext;
    	let $sectionContext;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Graphic", slots, ['default']);
    	const graphicId = getId$2();
    	let { width = 500 } = $$props;
    	let { height = 500 } = $$props;
    	let { viewBox = undefined } = $$props;
    	let { preserveAspectRatio = "xMidYMid meet" } = $$props;
    	let { scaleX = undefined } = $$props;
    	let { scaleY = undefined } = $$props;
    	let { flipX = false } = $$props;
    	let { flipY = false } = $$props;
    	let { padding = 0 } = $$props;
    	let { zoomIdentity = undefined } = $$props;
    	let { onClick = undefined } = $$props;
    	let { onWheel = undefined } = $$props;
    	let { onMousedown = undefined } = $$props;
    	let { onMouseup = undefined } = $$props;
    	let { onMouseover = undefined } = $$props;
    	let { onMouseout = undefined } = $$props;
    	let { onMousemove = undefined } = $$props;
    	let { onPinch = undefined } = $$props;
    	let { onTouchdown = undefined } = $$props;
    	let { onTouchmove = undefined } = $$props;
    	let { onTouchup = undefined } = $$props;
    	let { onTouchover = undefined } = $$props;
    	let { onTouchout = undefined } = $$props;
    	let { backgroundColor = undefined } = $$props;
    	let { paddingColor = undefined } = $$props;
    	let { transformation = undefined } = $$props;
    	let { blockReindexing = false } = $$props;
    	let { clip = true } = $$props;
    	let { renderer = undefined } = $$props;

    	// Contexts
    	const graphicContext = init$3();

    	const sectionContext = init$2();
    	validate_store(sectionContext, "sectionContext");
    	component_subscribe($$self, sectionContext, value => $$invalidate(48, $sectionContext = value));
    	const eventManagerContext = init$1();
    	const interactionManagerContext = init();
    	validate_store(interactionManagerContext, "interactionManagerContext");
    	component_subscribe($$self, interactionManagerContext, value => $$invalidate(47, $interactionManagerContext = value));
    	let rootNode;

    	// set up event and interaction manager
    	const eventManager = new EventManager();

    	update$1(eventManagerContext, eventManager);
    	const interactionManager = new InteractionManager();
    	interactionManager.setId(graphicId);
    	interactionManager.linkEventManager(eventManager);
    	update(interactionManagerContext, interactionManager);

    	// Keep SectionContext and InteractionManagerContext up to date
    	let numberWidth = width;

    	let numberHeight = height;
    	const originalViewBox = viewBox;
    	let originalViewBoxArray;

    	if (originalViewBox !== undefined) {
    		originalViewBoxArray = originalViewBox.split(" ");
    	}

    	onMount(() => {
    		// Only on mount can we bind the svg root node and attach actual event listeners.
    		// Sometimes rootNode is undefined for some weird reason. In this case,
    		// we will use document.getElementById instead
    		let _rootNode = rootNode ? rootNode : document.getElementById(graphicId);

    		eventManager.addRootNode(_rootNode);
    		eventManager.attachEventListeners();
    	});

    	function removeSectionInteractionsIfNecessary() {
    		if (primaryInput === "mouse") {
    			const sectionInterface = $interactionManagerContext.mouse().section();
    			sectionInterface.removeAllInteractions();
    			if (onWheel) sectionInterface.addInteraction("wheel", onWheel);
    			if (onClick) sectionInterface.addInteraction("click", onClick);
    			if (onMousedown) sectionInterface.addInteraction("mousedown", onMousedown);
    			if (onMouseup) sectionInterface.addInteraction("mouseup", onMouseup);
    			if (onMouseover) sectionInterface.addInteraction("mouseover", onMouseover);
    			if (onMouseout) sectionInterface.addInteraction("mouseout", onMouseout);
    			if (onMousemove) sectionInterface.addInteraction("mousemove", onMousemove);
    		}

    		if (primaryInput === "touch") {
    			const sectionInterface = $interactionManagerContext.touch().section();
    			sectionInterface.removeAllInteractions();
    			if (onTouchdown) sectionInterface.addInteraction("touchdown", onTouchdown);
    			if (onTouchmove) sectionInterface.addInteraction("touchmove", onTouchmove);
    			if (onTouchup) sectionInterface.addInteraction("touchup", onTouchup);
    			if (onTouchover) sectionInterface.addInteraction("touchover", onTouchover);
    			if (onTouchout) sectionInterface.addInteraction("touchout", onTouchout);
    			if (onPinch) sectionInterface.addInteraction("pinch", onPinch);
    		}
    	}

    	function selectRectangle(rectangle) {
    		$interactionManagerContext.select().selectRectangle(rectangle);
    	}

    	function updateSelectRectangle(rectangle) {
    		$interactionManagerContext.select().updateSelectRectangle(rectangle);
    	}

    	function resetSelectRectangle() {
    		$interactionManagerContext.select().resetSelectRectangle();
    	}

    	function startSelectPolygon(startCoordinates) {
    		$interactionManagerContext.select().startSelectPolygon(startCoordinates);
    	}

    	function addPointToSelectPolygon(pointCoordinates) {
    		$interactionManagerContext.select().addPointToSelectPolygon(pointCoordinates);
    	}

    	function moveSelectPolygon(delta) {
    		$interactionManagerContext.select().moveSelectPolygon(delta);
    	}

    	function getSelectPolygon() {
    		return $interactionManagerContext.select().getSelectPolygon();
    	}

    	function resetSelectPolygon() {
    		$interactionManagerContext.select().resetSelectPolygon();
    	}

    	const writable_props = [
    		"width",
    		"height",
    		"viewBox",
    		"preserveAspectRatio",
    		"scaleX",
    		"scaleY",
    		"flipX",
    		"flipY",
    		"padding",
    		"zoomIdentity",
    		"onClick",
    		"onWheel",
    		"onMousedown",
    		"onMouseup",
    		"onMouseover",
    		"onMouseout",
    		"onMousemove",
    		"onPinch",
    		"onTouchdown",
    		"onTouchmove",
    		"onTouchup",
    		"onTouchover",
    		"onTouchout",
    		"backgroundColor",
    		"paddingColor",
    		"transformation",
    		"blockReindexing",
    		"clip",
    		"renderer"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Graphic> was created with unknown prop '${key}'`);
    	});

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			rootNode = $$value;
    			$$invalidate(7, rootNode);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("viewBox" in $$props) $$invalidate(0, viewBox = $$props.viewBox);
    		if ("preserveAspectRatio" in $$props) $$invalidate(3, preserveAspectRatio = $$props.preserveAspectRatio);
    		if ("scaleX" in $$props) $$invalidate(13, scaleX = $$props.scaleX);
    		if ("scaleY" in $$props) $$invalidate(14, scaleY = $$props.scaleY);
    		if ("flipX" in $$props) $$invalidate(15, flipX = $$props.flipX);
    		if ("flipY" in $$props) $$invalidate(16, flipY = $$props.flipY);
    		if ("padding" in $$props) $$invalidate(17, padding = $$props.padding);
    		if ("zoomIdentity" in $$props) $$invalidate(18, zoomIdentity = $$props.zoomIdentity);
    		if ("onClick" in $$props) $$invalidate(19, onClick = $$props.onClick);
    		if ("onWheel" in $$props) $$invalidate(20, onWheel = $$props.onWheel);
    		if ("onMousedown" in $$props) $$invalidate(21, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(22, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(23, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(24, onMouseout = $$props.onMouseout);
    		if ("onMousemove" in $$props) $$invalidate(25, onMousemove = $$props.onMousemove);
    		if ("onPinch" in $$props) $$invalidate(26, onPinch = $$props.onPinch);
    		if ("onTouchdown" in $$props) $$invalidate(27, onTouchdown = $$props.onTouchdown);
    		if ("onTouchmove" in $$props) $$invalidate(28, onTouchmove = $$props.onTouchmove);
    		if ("onTouchup" in $$props) $$invalidate(29, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(30, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(31, onTouchout = $$props.onTouchout);
    		if ("backgroundColor" in $$props) $$invalidate(4, backgroundColor = $$props.backgroundColor);
    		if ("paddingColor" in $$props) $$invalidate(5, paddingColor = $$props.paddingColor);
    		if ("transformation" in $$props) $$invalidate(32, transformation = $$props.transformation);
    		if ("blockReindexing" in $$props) $$invalidate(33, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(6, clip = $$props.clip);
    		if ("renderer" in $$props) $$invalidate(34, renderer = $$props.renderer);
    		if ("$$scope" in $$props) $$invalidate(49, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		idCounter: idCounter$2,
    		getId: getId$2,
    		detectIt,
    		onMount,
    		GraphicContext: GraphicContext$1,
    		SectionContext,
    		EventManagerContext,
    		InteractionManagerContext,
    		EventManager,
    		InteractionManager,
    		getClipPropsPadding,
    		getClipPropsNoPadding,
    		graphicId,
    		width,
    		height,
    		viewBox,
    		preserveAspectRatio,
    		scaleX,
    		scaleY,
    		flipX,
    		flipY,
    		padding,
    		zoomIdentity,
    		onClick,
    		onWheel,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousemove,
    		onPinch,
    		onTouchdown,
    		onTouchmove,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		backgroundColor,
    		paddingColor,
    		transformation,
    		blockReindexing,
    		clip,
    		renderer,
    		graphicContext,
    		sectionContext,
    		eventManagerContext,
    		interactionManagerContext,
    		rootNode,
    		eventManager,
    		interactionManager,
    		numberWidth,
    		numberHeight,
    		originalViewBox,
    		originalViewBoxArray,
    		removeSectionInteractionsIfNecessary,
    		selectRectangle,
    		updateSelectRectangle,
    		resetSelectRectangle,
    		startSelectPolygon,
    		addPointToSelectPolygon,
    		moveSelectPolygon,
    		getSelectPolygon,
    		resetSelectPolygon,
    		coordinates,
    		$interactionManagerContext,
    		$sectionContext,
    		clipPropsPadding,
    		clipPropsNoPadding
    	});

    	$$self.$inject_state = $$props => {
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("viewBox" in $$props) $$invalidate(0, viewBox = $$props.viewBox);
    		if ("preserveAspectRatio" in $$props) $$invalidate(3, preserveAspectRatio = $$props.preserveAspectRatio);
    		if ("scaleX" in $$props) $$invalidate(13, scaleX = $$props.scaleX);
    		if ("scaleY" in $$props) $$invalidate(14, scaleY = $$props.scaleY);
    		if ("flipX" in $$props) $$invalidate(15, flipX = $$props.flipX);
    		if ("flipY" in $$props) $$invalidate(16, flipY = $$props.flipY);
    		if ("padding" in $$props) $$invalidate(17, padding = $$props.padding);
    		if ("zoomIdentity" in $$props) $$invalidate(18, zoomIdentity = $$props.zoomIdentity);
    		if ("onClick" in $$props) $$invalidate(19, onClick = $$props.onClick);
    		if ("onWheel" in $$props) $$invalidate(20, onWheel = $$props.onWheel);
    		if ("onMousedown" in $$props) $$invalidate(21, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(22, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(23, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(24, onMouseout = $$props.onMouseout);
    		if ("onMousemove" in $$props) $$invalidate(25, onMousemove = $$props.onMousemove);
    		if ("onPinch" in $$props) $$invalidate(26, onPinch = $$props.onPinch);
    		if ("onTouchdown" in $$props) $$invalidate(27, onTouchdown = $$props.onTouchdown);
    		if ("onTouchmove" in $$props) $$invalidate(28, onTouchmove = $$props.onTouchmove);
    		if ("onTouchup" in $$props) $$invalidate(29, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(30, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(31, onTouchout = $$props.onTouchout);
    		if ("backgroundColor" in $$props) $$invalidate(4, backgroundColor = $$props.backgroundColor);
    		if ("paddingColor" in $$props) $$invalidate(5, paddingColor = $$props.paddingColor);
    		if ("transformation" in $$props) $$invalidate(32, transformation = $$props.transformation);
    		if ("blockReindexing" in $$props) $$invalidate(33, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(6, clip = $$props.clip);
    		if ("renderer" in $$props) $$invalidate(34, renderer = $$props.renderer);
    		if ("rootNode" in $$props) $$invalidate(7, rootNode = $$props.rootNode);
    		if ("numberWidth" in $$props) $$invalidate(43, numberWidth = $$props.numberWidth);
    		if ("numberHeight" in $$props) $$invalidate(44, numberHeight = $$props.numberHeight);
    		if ("originalViewBoxArray" in $$props) $$invalidate(45, originalViewBoxArray = $$props.originalViewBoxArray);
    		if ("coordinates" in $$props) $$invalidate(46, coordinates = $$props.coordinates);
    		if ("clipPropsPadding" in $$props) $$invalidate(8, clipPropsPadding = $$props.clipPropsPadding);
    		if ("clipPropsNoPadding" in $$props) $$invalidate(9, clipPropsNoPadding = $$props.clipPropsNoPadding);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*renderer*/ 8) {
    			{
    				update$3(graphicContext, { renderer });
    			}
    		}

    		if ($$self.$$.dirty[0] & /*width, height*/ 6 | $$self.$$.dirty[1] & /*originalViewBoxArray*/ 16384) {
    			{
    				if (width.constructor === Number && height.constructor === Number) {
    					$$invalidate(43, numberWidth = width);
    					$$invalidate(44, numberHeight = height);
    				} else if (originalViewBox !== undefined) {
    					$$invalidate(43, numberWidth = Number(originalViewBoxArray[2]));
    					$$invalidate(44, numberHeight = Number(originalViewBoxArray[3]));
    				} else if (originalViewBox === undefined) {
    					$$invalidate(43, numberWidth = 100);
    					$$invalidate(44, numberHeight = 100);
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*numberWidth, numberHeight*/ 12288) {
    			$$invalidate(46, coordinates = {
    				x1: 0,
    				y1: 0,
    				x2: numberWidth,
    				y2: numberHeight
    			});
    		}

    		if ($$self.$$.dirty[0] & /*scaleX, scaleY, padding, flipX, flipY, zoomIdentity*/ 516096 | $$self.$$.dirty[1] & /*coordinates, blockReindexing, transformation, $interactionManagerContext, $sectionContext*/ 229382) {
    			{
    				const sectionData = {
    					sectionId: graphicId,
    					coordinates,
    					scaleX,
    					scaleY,
    					padding,
    					flipX,
    					flipY,
    					blockReindexing,
    					transformation,
    					zoomIdentity
    				};

    				update$2(sectionContext, sectionData);
    				$interactionManagerContext.loadSection($sectionContext);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*padding*/ 131072 | $$self.$$.dirty[1] & /*coordinates*/ 32768) {
    			$$invalidate(8, clipPropsPadding = getClipPropsPadding(coordinates, padding));
    		}

    		if ($$self.$$.dirty[1] & /*coordinates*/ 32768) {
    			$$invalidate(9, clipPropsNoPadding = getClipPropsNoPadding(coordinates));
    		}

    		if ($$self.$$.dirty[1] & /*numberWidth, numberHeight*/ 12288) {
    			{
    				if (originalViewBox === undefined) {
    					$$invalidate(0, viewBox = `0 0 ${numberWidth} ${numberHeight}`);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*onWheel, onClick, onMousedown, onMouseup, onMouseover, onMouseout, onTouchdown, onTouchmove, onTouchup, onTouchover, onPinch*/ 2113404928 | $$self.$$.dirty[1] & /*onTouchout*/ 1) {
    			// Interactions
    			// Change callbacks if necessary
    			{
    				removeSectionInteractionsIfNecessary();
    			}
    		}
    	};

    	return [
    		viewBox,
    		width,
    		height,
    		preserveAspectRatio,
    		backgroundColor,
    		paddingColor,
    		clip,
    		rootNode,
    		clipPropsPadding,
    		clipPropsNoPadding,
    		graphicId,
    		sectionContext,
    		interactionManagerContext,
    		scaleX,
    		scaleY,
    		flipX,
    		flipY,
    		padding,
    		zoomIdentity,
    		onClick,
    		onWheel,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousemove,
    		onPinch,
    		onTouchdown,
    		onTouchmove,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		transformation,
    		blockReindexing,
    		renderer,
    		selectRectangle,
    		updateSelectRectangle,
    		resetSelectRectangle,
    		startSelectPolygon,
    		addPointToSelectPolygon,
    		moveSelectPolygon,
    		getSelectPolygon,
    		resetSelectPolygon,
    		numberWidth,
    		numberHeight,
    		originalViewBoxArray,
    		coordinates,
    		$interactionManagerContext,
    		$sectionContext,
    		$$scope,
    		slots,
    		svg_binding
    	];
    }

    class Graphic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(
    			this,
    			options,
    			instance$c,
    			create_fragment$c,
    			safe_not_equal,
    			{
    				width: 1,
    				height: 2,
    				viewBox: 0,
    				preserveAspectRatio: 3,
    				scaleX: 13,
    				scaleY: 14,
    				flipX: 15,
    				flipY: 16,
    				padding: 17,
    				zoomIdentity: 18,
    				onClick: 19,
    				onWheel: 20,
    				onMousedown: 21,
    				onMouseup: 22,
    				onMouseover: 23,
    				onMouseout: 24,
    				onMousemove: 25,
    				onPinch: 26,
    				onTouchdown: 27,
    				onTouchmove: 28,
    				onTouchup: 29,
    				onTouchover: 30,
    				onTouchout: 31,
    				backgroundColor: 4,
    				paddingColor: 5,
    				transformation: 32,
    				blockReindexing: 33,
    				clip: 6,
    				renderer: 34,
    				selectRectangle: 35,
    				updateSelectRectangle: 36,
    				resetSelectRectangle: 37,
    				startSelectPolygon: 38,
    				addPointToSelectPolygon: 39,
    				moveSelectPolygon: 40,
    				getSelectPolygon: 41,
    				resetSelectPolygon: 42
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Graphic",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get width() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get viewBox() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set viewBox(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get preserveAspectRatio() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set preserveAspectRatio(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scaleX() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scaleX(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scaleY() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scaleY(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flipX() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flipX(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flipY() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flipY(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get zoomIdentity() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set zoomIdentity(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onWheel() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onWheel(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedown() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedown(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseup() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseup(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseover() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseover(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseout() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseout(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousemove() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousemove(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onPinch() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onPinch(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdown() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdown(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchmove() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchmove(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchup() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchup(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchover() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchover(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchout() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchout(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backgroundColor() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backgroundColor(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paddingColor() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paddingColor(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transformation() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transformation(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blockReindexing() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blockReindexing(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clip() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clip(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderer() {
    		throw new Error("<Graphic>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderer(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectRectangle() {
    		return this.$$.ctx[35];
    	}

    	set selectRectangle(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get updateSelectRectangle() {
    		return this.$$.ctx[36];
    	}

    	set updateSelectRectangle(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resetSelectRectangle() {
    		return this.$$.ctx[37];
    	}

    	set resetSelectRectangle(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get startSelectPolygon() {
    		return this.$$.ctx[38];
    	}

    	set startSelectPolygon(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addPointToSelectPolygon() {
    		return this.$$.ctx[39];
    	}

    	set addPointToSelectPolygon(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get moveSelectPolygon() {
    		return this.$$.ctx[40];
    	}

    	set moveSelectPolygon(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getSelectPolygon() {
    		return this.$$.ctx[41];
    	}

    	set getSelectPolygon(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get resetSelectPolygon() {
    		return this.$$.ctx[42];
    	}

    	set resetSelectPolygon(value) {
    		throw new Error("<Graphic>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function getKeyArray (keyProp, length) {
      if (keyProp) {
        if (keyProp.constructor !== Array) throw new Error('\'key\' must be Array')
        if (keyProp.length !== length) throw new Error('\'key\' must be of same length as positioning props')
        if (keyProp.some(key => key.constructor !== String)) {
          throw new Error('Keys can only be Strings')
        }

        return keyProp
      } else {
        return new Array(length).fill(0).map((_, i) => i.toString())
      }
    }

    function createPixelGeometryFromGeometry (
      geometry,
      sectionContext,
      renderSettings,
      geometryNeedsScaling
    ) {
      ensureValidGeometry(geometry);

      const interpolationNecessary = (
        sectionContext.transformation === 'polar' &&
        renderSettings.interpolate === true
      );

      if (interpolationNecessary) {
        const scaleTransformation = sectionContext.getScaleTransformation(geometryNeedsScaling);
        const postScaleTransformation = sectionContext.postScaleTransformation;

        return polarGeometry(
          geometry,
          sectionContext,
          { scaleTransformation, postScaleTransformation },
          renderSettings
        )
      }

      if (!interpolationNecessary) {
        const totalTransformation = sectionContext.getTotalTransformation(geometryNeedsScaling);

        return transformGeometry(geometry, totalTransformation, renderSettings)
      }
    }

    function ensureValidGeometry (geometry) {
      if (
        isDefined(geometry) &&
        geometry.constructor === Object &&
        'type' in geometry &&
        'coordinates' in geometry
      ) {
        return
      }

      throw new Error('Invalid geometry')
    }

    function createPixelGeometryObjectFromGeometry$1 (
      geometry,
      keyProp,
      sectionContext,
      renderSettings,
      geometryNeedsScaling
    ) {
      const keyArray = getKeyArray(keyProp, geometry.length);
      const pixelGeometryObject = {};

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        pixelGeometryObject[key] = createPixelGeometryFromGeometry(
          geometry[i],
          sectionContext,
          renderSettings,
          geometryNeedsScaling
        );
      }

      return pixelGeometryObject
    }

    function createPixelGeometry$7 (
      geometryProps,
      sectionContext,
      renderSettings
    ) {
      const scaledCoordinates = scaleCoordinates$2(geometryProps, sectionContext);
      const scaledGeometry = createScaledGeometry$1(scaledCoordinates);

      return createPixelGeometryFromGeometry(
        scaledGeometry,
        sectionContext,
        renderSettings,
        false
      )
    }

    function scaleCoordinates$2 (geometryProps, sectionContext) {
      ensureValidCombination(geometryProps);
      validateTypes(geometryProps);

      const { x1, x2, y1, y2 } = geometryProps;

      const scaledCoordinates = {};

      if (wereSpecified(x1, x2)) {
        scaledCoordinates.x1 = scaleCoordinate(x1, 'x1', sectionContext);
        scaledCoordinates.x2 = scaleCoordinate(x2, 'x2', sectionContext);
      } else {
        scaledCoordinates.x1 = sectionContext.rangeX[0];
        scaledCoordinates.x2 = sectionContext.rangeX[1];
      }

      if (wereSpecified(y1, y2)) {
        scaledCoordinates.y1 = scaleCoordinate(y1, 'y1', sectionContext);
        scaledCoordinates.y2 = scaleCoordinate(y2, 'y2', sectionContext);
      } else {
        scaledCoordinates.y1 = sectionContext.rangeY[0];
        scaledCoordinates.y2 = sectionContext.rangeY[1];
      }

      return scaledCoordinates
    }

    const s = JSON.stringify;

    function ensureValidCombination (c) {
      if (onlyOne(c.x1, c.x2)) {
        throw new Error(`Rectangle: invalid combination of 'x1' and 'x2': ${s(c.x1)}, ${s(c.x2)}. Either provide both or none.`)
      }

      if (onlyOne(c.y1, c.y2)) {
        throw new Error(`Rectangle: invalid combination of 'y1' and 'y2': ${s(c.y1)}, ${s(c.y2)}. Either provide both or none.`)
      }
    }

    function onlyOne (a, b) {
      return isUndefined(a) ? isDefined(b) : isUndefined(b)
    }

    const invalidCoordinateValueError = (value, name) => new Error(`Rectangle: invalid coordinate value for '${name}': ${s(value)}`);

    function validateTypes (geometryProps) {
      for (const coordinateName in geometryProps) {
        const coordinate = geometryProps[coordinateName];

        if (isDefined(coordinate)) {
          if (isInvalid(coordinate)) throw invalidCoordinateValueError(coordinate, coordinateName)

          if (![Number, String, Date, Function].includes(coordinate.constructor)) {
            throw invalidCoordinateValueError(coordinate, coordinateName)
          }
        }
      }
    }

    function wereSpecified (a, b) {
      return isDefined(a) && isDefined(b)
    }

    function scaleCoordinate (coordinate, coordinateName, sectionContext) {
      if (coordinate.constructor === Function) {
        return coordinate(sectionContext)
      } else {
        const scale = ['x1', 'x2'].includes(coordinateName) ? sectionContext.scaleX : sectionContext.scaleY;
        const scaledCoordinate = scale(coordinate);
        throwErrorIfInvalidScaledCoordinate(coordinate, scaledCoordinate, coordinateName);

        return scaledCoordinate
      }
    }

    function throwErrorIfInvalidScaledCoordinate (input, output, coordinateName) {
      const parentScale = ['x1', 'x2'].includes(coordinateName) ? 'scaleX' : 'scaleY';
      if (isInvalid(output)) throw new Error(`Scale '${parentScale}' received '${s(input)}' and returned '${s(output)}`)
    }

    function createScaledGeometry$1 (c) {
      return {
        type: 'Polygon',
        coordinates: [
          [
            [c.x1, c.y1],
            [c.x2, c.y1],
            [c.x2, c.y2],
            [c.x1, c.y2],
            [c.x1, c.y1]
          ]
        ]
      }
    }

    /**
     * Point props default and required or not are defined here.
     */

    var pointAesthetics = {
      x: {
        required: false
      },
      y: {
        required: false
      },
      geometry: {
        required: false
      },
      radius: {
        required: false,
        default: 3
      },
      fill: {
        required: false,
        default: 'black'
      },
      stroke: {
        required: false,
        default: 'none'
      },
      strokeWidth: {
        required: false,
        default: 0
      },
      fillOpacity: {
        required: false
      },
      strokeOpacity: {
        required: false
      },
      opacity: {
        required: false,
        default: 1
      }
    };

    var rectangleAesthetics = {
      x1: {
        required: false
      },
      x2: {
        required: false
      },
      y1: {
        required: false
      },
      y2: {
        required: false
      },
      fill: {
        required: false,
        default: 'black'
      },
      stroke: {
        required: false,
        default: 'none'
      },
      strokeWidth: {
        required: false,
        default: 0
      },
      fillOpacity: {
        required: false
      },
      strokeOpacity: {
        required: false
      },
      opacity: {
        required: false,
        default: 1
      }
    };

    var polygonAesthetics = {
      x: {
        required: false
      },
      y: {
        required: false
      },
      geometry: {
        required: false
      },
      fill: {
        required: false,
        default: 'black'
      },
      stroke: {
        required: false,
        default: 'none'
      },
      strokeWidth: {
        required: false,
        default: 0
      },
      fillOpacity: {
        required: false
      },
      strokeOpacity: {
        required: false
      },
      opacity: {
        required: false,
        default: 1
      }
    };

    var lineAesthetics = {
      x: {
        required: false
      },
      y: {
        required: false
      },
      geometry: {
        required: false
      },
      strokeWidth: {
        required: false,
        default: 3
      },
      stroke: {
        required: false,
        default: 'black'
      },
      opacity: {
        required: false,
        default: 1
      }
    };

    var labelAesthetics = {
      x: {
        required: false
      },
      y: {
        required: false
      },
      geometry: {
        required: false
      },
      fill: {
        required: false,
        default: 'black'
      },
      stroke: {
        required: false,
        default: 'none'
      },
      strokeWidth: {
        required: false,
        default: 0
      },
      fillOpacity: {
        required: false
      },
      strokeOpacity: {
        required: false
      },
      opacity: {
        required: false,
        default: 1
      },
      text: {
        required: false
      },
      fontFamily: {
        required: false,
        default: 'Helvetica'
      },
      fontSize: {
        required: false,
        default: 16
      },
      fontWeight: {
        required: false,
        default: 'normal'
      },
      rotation: {
        required: false,
        default: 0
      },
      anchorPoint: {
        required: false,
        default: 'center'
      }
    };

    var symbolAesthetics = {
      x: {
        required: false
      },
      y: {
        required: false
      },
      geometry: {
        required: false
      },
      shape: {
        required: false
      },
      size: {
        required: false
      },
      fill: {
        required: false,
        default: 'black'
      },
      stroke: {
        required: false,
        default: 'none'
      },
      strokeWidth: {
        required: false,
        default: 0
      },
      fillOpacity: {
        required: false
      },
      strokeOpacity: {
        required: false
      },
      opacity: {
        required: false,
        default: 1
      }
    };

    var areaAesthetics = {
      x1: {
        required: false
      },
      x2: {
        required: false
      },
      y1: {
        required: false
      },
      y2: {
        required: false
      },
      independentAxis: {
        required: false
      },
      fill: {
        required: false,
        default: 'black'
      },
      stroke: {
        required: false,
        default: 'none'
      },
      strokeWidth: {
        required: false,
        default: 0
      },
      strokeOpacity: {
        required: false
      },
      fillOpacity: {
        required: false
      },
      opacity: {
        required: false,
        default: 1
      }
    };

    function validateAesthetics (type, aesthetics) {
      if (type === 'Point') {
        return validateAesthetics$1(aesthetics, pointAesthetics)
      }

      if (type === 'Rectangle') {
        return validateAesthetics$1(aesthetics, rectangleAesthetics)
      }

      if (type === 'Polygon') {
        return validateAesthetics$1(aesthetics, polygonAesthetics)
      }

      if (type === 'Line') {
        return validateAesthetics$1(aesthetics, lineAesthetics)
      }

      if (type === 'Label') {
        return validateAesthetics$1(aesthetics, labelAesthetics)
      }

      if (type === 'Symbol') {
        return validateAesthetics$1(aesthetics, symbolAesthetics)
      }

      if (type === 'Area') {
        return validateAesthetics$1(aesthetics, areaAesthetics)
      }
    }

    function validateAesthetics$1 (passedAesthetics, allowedAesthetics) {
      const aesthetics = {};

      for (const aestheticName in passedAesthetics) {
        const aestheticValue = passedAesthetics[aestheticName];
        const aestheticRequirements = allowedAesthetics[aestheticName];

        if (isDefined(aestheticValue)) {
          if (!(aestheticName in allowedAesthetics)) throw aestheticNotAllowedError(aestheticName)
          aesthetics[aestheticName] = aestheticValue;
        }

        if (isUndefined(aestheticValue)) {
          if (aestheticName in allowedAesthetics) {
            if (aestheticRequirements.required) throw aestheticRequiredError(aestheticName)
            if (isDefined(aestheticRequirements.default)) {
              aesthetics[aestheticName] = aestheticRequirements.default;
            } else {
              aesthetics[aestheticName] = aestheticValue;
            }
          }
        }
      }

      return aesthetics
    }

    const aestheticNotAllowedError = name => {
      return new Error(`Aesthetic '${name}' not allowed`)
    };

    const aestheticRequiredError = name => {
      return new Error(`Required aesthetic '${name}' is missing`)
    };

    function ensureValidGeometryProps ({ x, y, geometry }, markType) {
      if (isDefined(x) && isDefined(y) && isUndefined(geometry)) return

      if (isUndefined(x) && isUndefined(y) && isDefined(geometry)) return

      throw new Error(`${markType}: Invalid combination of 'x', 'y', and 'geometry' props`)
    }

    function getInputType ({ x, y, geometry }) {
      if (isUndefined(geometry)) return 'xy'
      if (isDefined(geometry)) return 'geometry'
    }

    function validateXYProps (x, y) {
      if (![Array, Function].includes(x.constructor)) {
        throw new Error('\'x\' prop must be Array or Function')
      }

      if (![Array, Function].includes(y.constructor)) {
        throw new Error('\'y\' prop must be Array or Function')
      }
    }

    function validateGeometryPropLayer (geometry) {
      if (![Array, Function].includes(geometry.constructor)) {
        throw new Error('\'geometry\' prop must be Array or Function')
      }
    }

    function propNeedsScaling (prop) {
      return prop.constructor !== Function
    }

    function createPixelGeometry$6 (
      geometryProps,
      sectionContext,
      renderSettings
    ) {
      ensureValidGeometryProps(geometryProps);
      const inputType = getInputType(geometryProps);

      if (inputType === 'xy') {
        const xNeedsScaling = propNeedsScaling(geometryProps.x);
        const yNeedsScaling = propNeedsScaling(geometryProps.y);

        const x = xNeedsScaling
          ? geometryProps.x
          : geometryProps.x(sectionContext);

        const y = yNeedsScaling
          ? geometryProps.y
          : geometryProps.y(sectionContext);

        const totalTransformation = sectionContext.getTotalTransformation({ xNeedsScaling, yNeedsScaling });

        return transformGeometry({ type: 'Point', x, y }, totalTransformation, renderSettings)
      }

      if (inputType === 'geometry') {
        const needsScaling = propNeedsScaling(geometryProps.geometry);

        const geometry = needsScaling
          ? geometryProps.geometry
          : geometryProps.geometry(sectionContext);

        const totalTransformation = sectionContext.getTotalTransformation(needsScaling);

        return transformGeometry(geometry, totalTransformation, renderSettings)
      }
    }

    function createPixelGeometryFromXYArrays (
      { x, y },
      sectionContext,
      renderSettings,
      geometryType,
      needsScaling
    ) {
      validateXYArrays(x, y);

      if (geometryType === 'Polygon') {
        closeIfNecessary(x, y);
      }

      const rendervousInput = createRendervousInput(x, y, geometryType);

      const interpolationNecessary = (
        sectionContext.transformation === 'polar' &&
        renderSettings.interpolate === true
      );

      if (interpolationNecessary) {
        const scaleTransformation = sectionContext.getScaleTransformation(needsScaling);
        const postScaleTransformation = sectionContext.postScaleTransformation;

        return polarGeometry(
          rendervousInput,
          sectionContext,
          { scaleTransformation, postScaleTransformation },
          renderSettings
        )
      }

      if (!interpolationNecessary) {
        const totalTransformation = sectionContext.getTotalTransformation(needsScaling);

        return transformGeometry(rendervousInput, totalTransformation, renderSettings)
      }
    }

    function validateXYArrays (x, y) {
      if (x.constructor !== Array) {
        throw new Error('\'x\' prop must be Array or function that returns array')
      }

      if (y.constructor !== Array) {
        throw new Error('\'y\' prop must be Array or function that returns array')
      }

      if (x.length !== y.length) {
        throw new Error('Arrays passed to \'x\' and \'y\' must have the same length')
      }
    }

    function closeIfNecessary (x, y) {
      const xNotClosed = x[0] !== x[x.length - 1];
      const yNotClosed = y[0] !== y[y.length - 1];

      if (xNotClosed || yNotClosed) {
        x.push(x[0]);
        y.push(y[0]);
      }
    }

    function createRendervousInput (x, y, geometryType) {
      return {
        type: geometryType,
        x,
        y
      }
    }

    function createPixelGeometryObjectFromXYArrays (
      { x, y },
      keyProp,
      sectionContext,
      renderSettings,
      geometryType,
      needsScaling
    ) {
      validateXYArrays(x, y);

      const keyArray = getKeyArray(keyProp, x.length);
      const pixelGeometryObject = {};

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        pixelGeometryObject[key] = createPixelGeometryFromXYArrays(
          { x: x[i], y: y[i] },
          sectionContext,
          renderSettings,
          geometryType,
          needsScaling
        );
      }

      return pixelGeometryObject
    }

    function createPixelGeometry$5 (
      geometryProps,
      sectionContext,
      renderSettings
    ) {
      ensureValidGeometryProps(geometryProps);
      const inputType = getInputType(geometryProps);

      if (inputType === 'xy') {
        const xNeedsScaling = propNeedsScaling(geometryProps.x);
        const yNeedsScaling = propNeedsScaling(geometryProps.y);

        const x = xNeedsScaling
          ? geometryProps.x
          : geometryProps.x(sectionContext);

        const y = yNeedsScaling
          ? geometryProps.y
          : geometryProps.y(sectionContext);

        return createPixelGeometryFromXYArrays(
          { x, y },
          sectionContext,
          renderSettings,
          'Polygon',
          { xNeedsScaling, yNeedsScaling }
        )
      }

      if (inputType === 'geometry') {
        const needsScaling = propNeedsScaling(geometryProps.geometry);

        const geometry = needsScaling
          ? geometryProps.geometry
          : geometryProps.geometry(sectionContext);

        return createPixelGeometryFromGeometry(
          geometry,
          sectionContext,
          renderSettings,
          needsScaling
        )
      }
    }

    function createPixelGeometry$4 (
      geometryProps,
      sectionContext,
      renderSettings
    ) {
      ensureValidGeometryProps(geometryProps);
      const inputType = getInputType(geometryProps);

      if (inputType === 'xy') {
        const xNeedsScaling = propNeedsScaling(geometryProps.x);
        const yNeedsScaling = propNeedsScaling(geometryProps.y);

        const x = xNeedsScaling
          ? geometryProps.x
          : geometryProps.x(sectionContext);

        const y = yNeedsScaling
          ? geometryProps.y
          : geometryProps.y(sectionContext);

        return createPixelGeometryFromXYArrays(
          { x, y },
          sectionContext,
          renderSettings,
          'LineString',
          { xNeedsScaling, yNeedsScaling }
        )
      }

      if (inputType === 'geometry') {
        const needsScaling = propNeedsScaling(geometryProps.geometry);

        const geometry = needsScaling
          ? geometryProps.geometry
          : geometryProps.geometry(sectionContext);

        return createPixelGeometryFromGeometry(
          geometry,
          sectionContext,
          renderSettings,
          needsScaling
        )
      }
    }

    var geometryAlias = {
      cross: [
        [-0.5, -1], [0.5, -1], [0.5, -0.5], [1, -0.5], [1, 0.5], [0.5, 0.5], [0.5, 1], [-0.5, 1], [-0.5, 0.5], [-1, 0.5], [-1, -0.5], [-0.5, -0.5], [-0.5, -1], [-0.5, -1]
      ],
      'cross-sharp': [
        [0, -1], [0.2, -0.2], [1, 0], [0.2, 0.2], [0, 1], [-0.2, 0.2], [-1, 0], [-0.2, -0.2], [0, -1]
      ],
      diamond: [
        [0, -1], [1, 0], [0, 1], [-1, 0], [0, -1], [0, -1]
      ],
      'triangle-up': [
        [0, -1], [1, 1], [-1, 1], [0, -1], [0, -1]
      ],
      'triangle-down': [
        [1, -1], [0, 1], [-1, -1], [1, -1], [1, -1]
      ],
      'triangle-right': [
        [-1, -1], [1, 0], [-1, 1], [-1, -1], [-1, -1]
      ],
      'triangle-left': [
        [1, -1], [-1, 0], [1, 1], [1, -1], [1, -1]
      ],
      star4: [
        [0, 0.71], [1, 1], [0.71, 0], [1, -1], [0, -0.71], [-1, -1], [-0.71, 0], [-1, 1], [0, 0.71], [0, 0.71]
      ],
      star5: [
        [0, 0.5], [0.6, 0.8], [0.5, 0.1], [1, -0.3], [0.3, -0.4], [0, -1], [-0.3, -0.4], [-1, -0.3], [-0.5, 0.1], [-0.6, 0.8], [0, 0.5], [0, 0.5]
      ],
      star: [
        [0, 0.5], [0.6, 0.8], [0.5, 0.1], [1, -0.3], [0.3, -0.4], [0, -1], [-0.3, -0.4], [-1, -0.3], [-0.5, 0.1], [-0.6, 0.8], [0, 0.5], [0, 0.5]
      ],
      star6: [
        [0, 0.58], [0.5, 1], [0.43, 0.29], [1, 0], [0.43, -0.29], [0.5, -1], [0, -0.58], [-0.5, -1], [-0.43, -0.29], [-1, 0], [-0.43, 0.29], [-0.5, 1], [0, 0.58]
      ],
      star8: [
        [0, 0.54], [0.41, 1], [0.38, 0.38], [1, 0.41], [0.54, 0], [1, -0.41], [0.38, -0.38], [0.41, -1], [0, -0.54], [-0.41, -1], [-0.38, -0.38], [-1, -0.41], [-0.54, 0], [-1, 0.41], [-0.38, 0.38], [-0.41, 1], [0, 0.54]
      ],
      pentagon: [
        [-1, -0.24], [0, -1], [1, -0.24], [0.62, 1], [-0.62, 1], [-1, -0.24], [-1, -0.24]
      ],
      hexagon: [
        [-1, 0], [-0.57, -1], [0.57, -1], [1, 0], [0.57, 1], [-0.57, 1], [-1, 0], [-1, 0]
      ],
      heptagon: [
        [-1, 0.29], [-0.8, -0.6], [0, -1], [0.8, -0.6], [1, 0.29], [0.45, 1], [-0.45, 1], [-1, 0.29], [-1, 0.29]
      ],
      septagon: [
        [-1, 0.29], [-0.8, -0.6], [0, -1], [0.8, -0.6], [1, 0.29], [0.45, 1], [-0.45, 1], [-1, 0.29], [-1, 0.29]
      ],
      octagon: [
        [-1, -0.41], [-0.41, -1], [0.41, -1], [1, -0.41], [1, 0.41], [0.41, 1], [-0.41, 1], [-1, 0.41], [-1, -0.41], [-1, -0.41]
      ],
      nonagon: [
        [0.35, -1], [0.88, -0.55], [1, 0.15], [0.65, 0.76], [0, 1], [-0.65, 0.76], [-1, 0.15], [-0.88, -0.55], [-0.35, -1], [0.35, -1], [0.35, -1]
      ],
      decagon: [
        [-1, 0], [-0.81, -0.62], [-0.31, -1], [0.31, -1], [0.81, -0.62], [1, 0], [0.81, 0.62], [0.31, 1], [-0.31, 1], [-0.81, 0.62], [-1, 0], [-1, 0]
      ]
    };

    // https://stackoverflow.com/a/155678/7237112
    function representPointAsPolygon (point, { radius }) {
      const x = point.coordinates[0];
      const y = point.coordinates[1];

      const circumference = Math.PI * 2 * radius;
      const steps = Math.max(Math.ceil(circumference), 9);

      const polygon = {
        type: 'Polygon',
        coordinates: [[]]
      };

      for (let i = 0; i < steps; i++) {
        polygon.coordinates[0].push(
          [
            x + radius * Math.cos(Math.PI * i / steps * 2 - Math.PI / 2),
            y + radius * Math.sin(Math.PI * i / steps * 2 - Math.PI / 2)
          ]
        );
      }

      // close polygon
      polygon.coordinates[0].push(polygon.coordinates[0][0]);

      return polygon
    }

    function representPointsAsPolygons (points, { radiusObject }) {
      const polygons = {};

      for (const key in points) {
        polygons[key] = representPointAsPolygon(points[key], { radius: radiusObject[key] });
      }

      return polygons
    }

    function createPixelGeometry$3 (
      geometryProps,
      sectionContext,
      renderSettings
    ) {
      const pointGeometry = createPixelGeometry$6(
        geometryProps,
        sectionContext,
        renderSettings
      );

      const symbolGeometry = createSymbolGeometry(pointGeometry, geometryProps);

      return symbolGeometry
    }

    function createSymbolGeometry (pointGeometry, geometryProps) {
      const [cx, cy] = pointGeometry.coordinates;

      const shape = geometryProps.shape || 'circle';
      const size = geometryProps.size || 8;

      if (shape === 'circle') {
        return createPoint(cx, cy, size)
      }

      if (shape === 'square') {
        return createSquare(cx, cy, size)
      }

      if (shape in geometryAlias) {
        const coordinates = [geometryAlias[shape]];
        const geometry = {
          type: 'Polygon',
          coordinates
        };

        return createSymbolFromGeometry(cx, cy, geometry, size)
      }

      return createSymbolFromGeometry(cx, cy, shape, size)
    }

    function createPoint (cx, cy, size) {
      const radius = size / 2;
      const pointGeometry = {
        type: 'Point',
        coordinates: [cx, cy]
      };
      return representPointAsPolygon(pointGeometry, { radius })
    }

    function createSquare (cx, cy, size) {
      const halfSize = size / 2;

      const x1 = cx - halfSize;
      const x2 = cx + halfSize;
      const y1 = cy - halfSize;
      const y2 = cy + halfSize;

      return createScaledGeometry$1({ x1, x2, y1, y2 })
    }

    function createSymbolFromGeometry (cx, cy, geometry, size) {
      const halfSize = size / 2;
      const transformation = p => [p[0] * halfSize + cx, p[1] * halfSize + cy];

      return transformGeometry(geometry, transformation)
    }

    function createPixelGeometry$2 (
      geometryProps,
      sectionContext,
      renderSettings
    ) {
      // filter for allowed props; leave any undefined props in place
      const allowedProps =
        (({
          x1 = undefined,
          y1 = undefined,
          x2 = undefined,
          y2 = undefined,
          independentAxis = undefined
        }) => ({ x1, y1, x2, y2, independentAxis }))(geometryProps);

      const scaledGeometry = createScaledGeometry(scaleCoordinates$1(augmentProps(validateProps(normalize(
        allowedProps,
        sectionContext
      ))), sectionContext));

      return createPixelGeometryFromGeometry(
        scaledGeometry,
        sectionContext,
        renderSettings,
        false
      )
    }

    function normalize ({ independentAxis, ...coordinateProps }, sectionContext) {
      const normalized = Object.entries(coordinateProps).reduce((acc, [k, v]) => {
        const extracted = typeof v === 'function' ? v(sectionContext) : v;

        acc[k] = {
          type: extracted === undefined ? 'none' : Array.isArray(extracted) ? 'array' : 'singleton',
          ...(Array.isArray(extracted) && { arrayLength: extracted.length }),
          value: extracted,
          scaled: typeof v === 'function'
        };
        return acc
      }, {});
      normalized.independentAxis = independentAxis && independentAxis.toLowerCase();
      return normalized
    }

    function validateProps (normalized) {
      const { independentAxis, ...coordinateProps } = normalized;

      const definedTypes = ['singleton', 'array'];
      const definedProps = Object.entries(coordinateProps)
        .filter(([k, v]) => definedTypes.includes(v.type))
        .reduce((acc, [k, v]) => {
          acc[k] = coordinateProps[k];
          return acc
        }, {});

      const definedKeys = Object.keys(definedProps);

      // reject if props do not include x1 and y1
      const containsx1y1 = ['x1', 'y1'].every(k => definedKeys.includes(k));
      if (!containsx1y1) { throw new Error('At least x1 and y1 must be provided') }

      // reject if at least x1 or y1 is not an array
      if (definedProps.x1.type === 'singleton' && definedProps.y1.type === 'singleton') {
        throw new Error('At least x1 or y1 must be passed an array')
      }

      // reject if independentAxis does not align with x/y types
      if (!independentAxis || independentAxis === 'x') {
        // check that x is the independent variable
        // reject if x1 is not given an array of at least length 2 - x must not be constant
        // x1 should also be distinct (for all types) and monotonically increasing for Number/Date types, but no checks will be performed for these
        if (definedProps.x1.type === 'singleton' || (definedProps.x1.type === 'array' && definedProps.x1.arrayLength < 2)) {
          throw new Error('x1 must be passed an array of at least length 2 when independentAxis is "x" or undefined')
        }
        // reject if x1, y1 and x2 are provided but independentAxis is not y
        if (definedKeys.includes('x2')) {
          throw new Error('independentAxis must be "y" when x1, y1 and x2 are specified')
        }
      } else if (independentAxis === 'y') {
        // check that y is the independent variable
        // reject if y1 is not given an array of at least length 2 - y must not be constant
        // y1 should also be distinct (for all types) and monotonically increasing for Number/Date types, but no checks will be performed for these
        if (definedProps.y1.type === 'singleton' || (definedProps.y1.type === 'array' && definedProps.y1.arrayLength < 2)) {
          throw new Error('y1 must be passed an array of at least length 2 when independentAxis is "y"')
        }
        // reject if x1, y1 and y2 are provided but independentAxis is not x
        if (definedKeys.includes('y2')) {
          throw new Error('independentAxis must be "x" when x1, y1 and y2 are specified')
        }
      } else {
        // reject if defined independentAxis is passed a value other than X or Y
        throw new Error('independentAxis must be passed "x" or "y" or left blank')
      }

      // reject if arrays given are not of equal length
      const arrayLengths = Object.values(definedProps)
        .filter(v => v.type === 'array')
        .map(v => v.value.length);

      const arrayLengthsEqual = arrayLengths.every((val, idx, arr) => val === arr[0]);
      if (!arrayLengthsEqual) { throw new Error('Arrays given must be of equal length') }

      return normalized
    }

    function augmentProps ({ independentAxis, x1, y1, x2, y2 }) {
      const indAx = !independentAxis || independentAxis === 'x' ? 'x' : 'y';

      const [indKey, indVal] = indAx === 'x' ? ['x1', x1] : ['y1', y1];
      const [depKey1, depVal1] = indAx === 'x' ? ['y1', y1] : ['x1', x1];
      const [depKey2, depVal2] = indAx === 'x' ? ['y2', y2] : ['x2', x2];
      const length = indVal.arrayLength;

      const depVal1Map = {
        singleton: {
          value: Array(length).fill(depVal1.value),
          type: 'array',
          arrayLength: length
        },
        array: depVal1
      };
      const depVal2Map = {
        singleton: {
          value: Array(length).fill(depVal2.value),
          type: 'array',
          arrayLength: length
        },
        none: {
          value: Array(length).fill(0),
          type: 'array',
          arrayLength: length
        },
        array: depVal2
      };

      return {
        independentAxis: indAx,
        [indKey]: indVal,
        [depKey1]: depVal1Map[depVal1.type],
        [depKey2]: depVal2Map[depVal2.type]
      }
    }

    const scaleMap = { x1: 'scaleX', y1: 'scaleY', x2: 'scaleX', y2: 'scaleY' };

    function scaleCoordinates$1 ({ independentAxis, ...coordinateProps }, sectionContext) {
      const scaledProps = Object.entries(coordinateProps).reduce((acc, [k, v]) => {
        if (v.scaled) {
          acc[k] = v.value;
        } else {
          const scale = sectionContext[scaleMap[k]];
          acc[k] = v.value.map(d => scale(d));
        }
        return acc
      }, {});
      return { independentAxis, ...scaledProps }
    }

    function createScaledGeometry ({ x1, y1, x2, y2, independentAxis }) {
      // polygon outer ring is defined counterclockwise

      let bottomPoints, topPoints;

      if (independentAxis === 'x') {
        bottomPoints = y2.map((y2, i) => [x1[i], y2]);
        topPoints = y1.map((y1, i) => [x1[i], y1]).reverse();
      } else { // y independent
        bottomPoints = x2.map((x2, i) => [x2, y1[i]]);
        topPoints = x1.map((x1, i) => [x1, y1[i]]).reverse();
      }

      const origin = [bottomPoints[0]];
      const allPoints = [bottomPoints.concat(topPoints, origin)];

      const scaledGeometryArray = { type: 'Polygon', coordinates: allPoints };
      return scaledGeometryArray
    }

    function createPixelGeometryObject$3 (
      geometryProps,
      keyProp,
      sectionContext,
      renderSettings
    ) {
      ensureValidGeometryProps(geometryProps);

      const inputType = getInputType(geometryProps);

      if (inputType === 'xy') {
        return createPixelGeometryObjectFromCoordinates(
          geometryProps,
          keyProp,
          sectionContext)
      }

      if (inputType === 'geometry') {
        return createPixelGeometryObjectFromGeometry(
          geometryProps,
          keyProp,
          sectionContext)
      }
    }

    function createPixelGeometryObjectFromCoordinates (
      { x, y },
      keyProp,
      sectionContext,
      renderSettings
    ) {
      validateXYProps(x, y);

      const xNeedsScaling = propNeedsScaling(x);
      const yNeedsScaling = propNeedsScaling(y);

      const xScaled = xNeedsScaling
        ? x
        : x(sectionContext);

      const yScaled = yNeedsScaling
        ? y
        : y(sectionContext);

      const { xArray, yArray } = applyRecyclingIfNecessary(xScaled, yScaled);
      validateXYArrays(xArray, yArray);

      const keyArray = getKeyArray(keyProp, xArray.length);

      const totalTransformation = sectionContext.getTotalTransformation({ xNeedsScaling, yNeedsScaling });

      return transformXYArraysIntoGeometryObject(xArray, yArray, keyArray, totalTransformation)
    }

    function applyRecyclingIfNecessary (xScaled, yScaled) {
      if (xScaled.constructor !== Array && yScaled.constructor !== Array) {
        throw new Error('Invalid input: cannot recycle all geometry props')
      }

      return {
        xArray: xScaled.constructor === Array ? xScaled : recycle(xScaled, yScaled.length),
        yArray: yScaled.constructor === Array ? yScaled : recycle(yScaled, xScaled.length)
      }
    }

    function recycle (value, length) {
      return new Array(length).fill(value)
    }

    function transformXYArraysIntoGeometryObject (xArray, yArray, keyArray, transformation) {
      const geometryObject = {};

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        geometryObject[key] = {
          type: 'Point',
          coordinates: transformation([
            xArray[i],
            yArray[i]
          ])
        };
      }

      return geometryObject
    }

    function createPixelGeometryObjectFromGeometry (
      geometryProps,
      keyProp,
      sectionContext,
      renderSettings
    ) {
      validateGeometryPropLayer(geometryProps.geometry);

      const geometryNeedsScaling = propNeedsScaling(geometryProps.geometry);

      const geometry = geometryNeedsScaling
        ? geometryProps.geometry
        : geometryProps.geometry(sectionContext);

      const keyArray = getKeyArray(keyProp, geometry.length);

      const totalTransformation = sectionContext.getTotalTransformation(geometryNeedsScaling);

      return transformGeometryArrayIntoGeometryObject(
        geometry,
        keyArray,
        totalTransformation
      )
    }

    function transformGeometryArrayIntoGeometryObject (geometryArray, keyArray, transformation) {
      const geometryObject = {};

      for (let i = 0; i < keyArray.length; i++) {
        const key = keyArray[i];

        geometryObject[key] = {
          type: 'Point',
          coordinates: transformation(geometryArray[i].coordinates)
        };
      }

      return geometryObject
    }

    function generateArrayOfLength (value, length) {
      return new Array(length).fill(value)
    }

    function createPixelGeometryObject$2 (
      geometryProps,
      keyProp,
      sectionContext,
      renderSettings
    ) {
      const { scaledCoordinates, length } = scaleCoordinates(geometryProps, sectionContext);
      const scaledGeometryArray = createScaledGeometryArray(scaledCoordinates, length);

      return createPixelGeometryObjectFromGeometry$1(
        scaledGeometryArray,
        keyProp,
        sectionContext,
        renderSettings,
        false
      )
    }

    function scaleCoordinates (coordinateProps, sectionContext) {
      ensureValidCombination(coordinateProps);

      const coordinatesThatNeedScaling = whichCoordinatesNeedScaling(coordinateProps);

      const nonMissingCoordinates = getMissingCoordinatesFromContext(coordinateProps, sectionContext);
      const coordinateValues = getCoordinateValues(nonMissingCoordinates, sectionContext);

      const length = getNRectangles(coordinateValues);

      const coordinatesThatArePrimitive = whichCoordinatesArePrimitive(coordinateValues);

      const scaledCoordinates = _scaleCoordinates(
        coordinateValues,
        sectionContext,
        coordinatesThatNeedScaling,
        coordinatesThatArePrimitive,
        length
      );

      return { scaledCoordinates, length }
    }

    const coordinateNames = ['x1', 'x2', 'y1', 'y2'];

    function whichCoordinatesNeedScaling (coordinates) {
      const coordinatesThatNeedScaling = {};

      for (const coordinateName of coordinateNames) {
        const coordinateValue = coordinates[coordinateName];
        coordinatesThatNeedScaling[coordinateName] = isDefined(coordinateValue) && coordinateValue.constructor !== Function;
      }

      return coordinatesThatNeedScaling
    }

    function getMissingCoordinatesFromContext (coordinates, sectionContext) {
      const nonMissingCoordinates = {};

      for (const coordinateName of coordinateNames) {
        const coordinateValue = coordinates[coordinateName];
        nonMissingCoordinates[coordinateName] = isUndefined(coordinateValue)
          ? getMissingCoordinateFromContext(coordinateName, sectionContext)
          : coordinateValue;
      }

      return nonMissingCoordinates
    }

    const coordMap = { x1: 'minX', x2: 'maxX', y1: 'minY', y2: 'maxY' };

    function getMissingCoordinateFromContext (coordinateName, sectionContext) {
      return sectionContext.paddedBbox[coordMap[coordinateName]]
    }

    function getCoordinateValues (nonMissingCoordinates, sectionContext) {
      const coordinateValues = {};

      for (const coordinateName in nonMissingCoordinates) {
        const coordinateValue = nonMissingCoordinates[coordinateName];
        if (coordinateValue.constructor === Function) {
          coordinateValues[coordinateName] = coordinateValue(sectionContext);
        } else {
          coordinateValues[coordinateName] = coordinateValue;
        }
      }

      return coordinateValues
    }

    const invalidCoordinateError = new Error('RectangleLayer: invalid coordinate specification');

    function getNRectangles (coordinateValues) {
      let atLeastOneArray = false;
      let length;

      for (const coordinateName in coordinateValues) {
        const coordinateValue = coordinateValues[coordinateName];

        if (coordinateValue.constructor === Array) {
          atLeastOneArray = true;
          length = length || coordinateValue.length;

          if (length !== coordinateValue.length) throw invalidCoordinateError
        }
      }

      if (!atLeastOneArray) throw invalidCoordinateError

      return length
    }

    function whichCoordinatesArePrimitive (coordinateValues) {
      const coordinatesThatArePrimitive = {};

      for (const coordinateName in coordinateValues) {
        const coordinateValue = coordinateValues[coordinateName];

        coordinatesThatArePrimitive[coordinateName] = coordinateValue.constructor !== Array;
      }

      return coordinatesThatArePrimitive
    }

    function _scaleCoordinates (
      coordinateValues, scales, coordinatesThatNeedScaling, coordinatesThatArePrimitive, length
    ) {
      const scaledCoordinates = {};

      for (const coordinateName in coordinateValues) {
        const coordinateValue = coordinateValues[coordinateName];
        let array;
        const scale = coordinateName.startsWith('x') ? scales.scaleX : scales.scaleY;

        if (coordinatesThatArePrimitive[coordinateName]) array = generateArrayOfLength(coordinateValue, length);
        if (!coordinatesThatArePrimitive[coordinateName]) array = coordinateValue;

        scaledCoordinates[coordinateName] = coordinatesThatNeedScaling[coordinateName]
          ? array.map(scale)
          : array;
      }

      return scaledCoordinates
    }

    function createScaledGeometryArray (scaledCoordinates, length) {
      const scaledGeometryArray = [];

      for (let i = 0; i < length; i++) {
        scaledGeometryArray.push(
          createScaledGeometry$1({
            x1: scaledCoordinates.x1[i],
            x2: scaledCoordinates.x2[i],
            y1: scaledCoordinates.y1[i],
            y2: scaledCoordinates.y2[i]
          })
        );
      }

      return scaledGeometryArray
    }

    function createPixelGeometry$1 (
      geometryProps,
      keyProp,
      sectionContext,
      renderSettings
    ) {
      ensureValidGeometryProps(geometryProps);
      const inputType = getInputType(geometryProps);

      if (inputType === 'xy') {
        const xNeedsScaling = propNeedsScaling(geometryProps.x);
        const yNeedsScaling = propNeedsScaling(geometryProps.y);

        const x = xNeedsScaling
          ? geometryProps.x
          : geometryProps.x(sectionContext);

        const y = yNeedsScaling
          ? geometryProps.y
          : geometryProps.y(sectionContext);

        return createPixelGeometryObjectFromXYArrays(
          { x, y },
          keyProp,
          sectionContext,
          renderSettings,
          'Polygon',
          { xNeedsScaling, yNeedsScaling }
        )
      }

      if (inputType === 'geometry') {
        const needsScaling = propNeedsScaling(geometryProps.geometry);

        const geometry = needsScaling
          ? geometryProps.geometry
          : geometryProps.geometry(sectionContext);

        return createPixelGeometryObjectFromGeometry$1(
          geometry,
          keyProp,
          sectionContext,
          renderSettings,
          needsScaling
        )
      }
    }

    function createPixelGeometry (
      geometryProps,
      keyProp,
      sectionContext,
      renderSettings
    ) {
      ensureValidGeometryProps(geometryProps);
      const inputType = getInputType(geometryProps);

      if (inputType === 'xy') {
        const xNeedsScaling = propNeedsScaling(geometryProps.x);
        const yNeedsScaling = propNeedsScaling(geometryProps.y);

        const x = xNeedsScaling
          ? geometryProps.x
          : geometryProps.x(sectionContext);

        const y = yNeedsScaling
          ? geometryProps.y
          : geometryProps.y(sectionContext);

        return createPixelGeometryObjectFromXYArrays(
          { x, y },
          keyProp,
          sectionContext,
          renderSettings,
          'LineString',
          { xNeedsScaling, yNeedsScaling }
        )
      }

      if (inputType === 'geometry') {
        const needsScaling = propNeedsScaling(geometryProps.geometry);

        const geometry = needsScaling
          ? geometryProps.geometry
          : geometryProps.geometry(sectionContext);

        return createPixelGeometryObjectFromGeometry$1(
          geometry,
          keyProp,
          sectionContext,
          renderSettings,
          needsScaling
        )
      }
    }

    function createPixelGeometryObject$1 (
      geometryProps,
      keyProp,
      sectionContext,
      renderSettings
    ) {
      const pointGeometryObject = createPixelGeometryObject$3(
        geometryProps,
        keyProp,
        sectionContext);

      const symbolGeometryObject = createSymbolGeometryObject(pointGeometryObject, geometryProps);

      return symbolGeometryObject
    }

    function createSymbolGeometryObject (pointGeometryObject, geometryProps) {
      const keys = Object.keys(pointGeometryObject);

      const shapeGetter = createPropGetter(geometryProps.shape, keys);
      const sizeGetter = createPropGetter(geometryProps.size, keys);

      const symbolGeometryObject = {};

      for (const key in pointGeometryObject) {
        const shape = shapeGetter(key);
        const size = sizeGetter(key);

        symbolGeometryObject[key] = createSymbolGeometry(pointGeometryObject[key], { shape, size });
      }

      return symbolGeometryObject
    }

    function createPropGetter (prop, keys) {
      if (prop === undefined) return () => {}

      if (prop.constructor === Function) {
        return prop
      }

      const propObject = createPropObject(prop, keys);
      return key => propObject[key]
    }

    function createPropObject (prop, keys) {
      const length = keys.length;
      const propObject = {};

      if (prop.constructor === Array) {
        validatePropArrayLength(prop, length);

        for (let i = 0; i < length; i++) {
          const key = keys[i];
          propObject[key] = prop[i];
        }
      } else {
        for (let i = 0; i < length; i++) {
          const key = keys[i];
          propObject[key] = prop;
        }
      }

      return propObject
    }

    function validatePropArrayLength (prop, length) {
      if (prop.length !== length) {
        throw new Error('If provided as Arrays, all positioning props must be the same length')
      }
    }

    function createPixelGeometryObject (
      geometryProps,
      keyProp,
      sectionContext,
      renderSettings
    ) {
      // filter for allowed props; leave any undefined props in place
      const allowedProps =
        (({
          x1 = undefined,
          y1 = undefined,
          x2 = undefined,
          y2 = undefined,
          independentAxis = undefined
        }) => ({ x1, y1, x2, y2, independentAxis }))(geometryProps);

      const { numAreas, independentAxis, ...augmentedAreas } =
        augmentAreas(
          validateAreas(
            normalizeAreas(
              allowedProps,
              sectionContext)));

      // pivot data for use with area mark methods
      const areasAsArray = [...Array(numAreas).keys()].map(areaIndex =>
        Object.entries(augmentedAreas).reduce((acc, [k, v]) => {
          const isNestedArray = v.type === 'array of arrays';

          acc[k] = {
            type: isNestedArray ? 'array' : 'none',
            value: isNestedArray ? v.value[areaIndex] : v.value,
            ...(isNestedArray && { arrayLength: v.value[areaIndex].length }),
            scaled: v.scaled
          };

          acc.independentAxis = independentAxis;
          return acc
        }, {})
      );

      const scaledGeometryArray = areasAsArray.map(area => {
        return createScaledGeometry(
          scaleCoordinates$1(
            augmentProps(
              validateProps(
                area)),
            sectionContext))
      });

      return createPixelGeometryObjectFromGeometry$1(
        scaledGeometryArray,
        keyProp,
        sectionContext,
        renderSettings,
        false
      )
    }

    function normalizeAreas ({ independentAxis, ...coordinateProps }, sectionContext) {
      const normalized = Object.entries(coordinateProps).reduce((acc, [k, v]) => {
        const extracted = typeof v === 'function' ? v(sectionContext) : v;

        const isUndefined = (x) => typeof x === 'undefined';
        const isSingleton = (x) => !isUndefined(x) && !Array.isArray(x);
        const isNestedArray = (xs) => !isUndefined(xs) && !isSingleton(xs) && xs.every(x => Array.isArray(x));

        acc[k] = {
          type: isUndefined(extracted)
            ? 'none'
            : isSingleton(extracted)
              ? 'singleton'
              : isNestedArray(extracted)
                ? 'array of arrays'
                : 'array',
          ...(isNestedArray(extracted) && { numAreas: extracted.length }),
          value: extracted,
          scaled: typeof v === 'function'
        };
        return acc
      }, {});

      normalized.independentAxis = independentAxis && independentAxis.toLowerCase();
      return normalized
    }

    function validateAreas (normalizedAreas) {
      const { independentAxis, ...coordinateProps } = normalizedAreas;
      const { x1, x2, y1, y2 } = coordinateProps;

      // reject singletons
      Object.values(coordinateProps).forEach(v => {
        if (v.type === 'singleton') {
          throw new Error('Props passed to the AreaLayer must be either an array or an array of arrays')
        }
      });

      const indAx = !independentAxis || independentAxis === 'x' ? 'x' : 'y';
      const [depKey1, depVal1] = indAx === 'x' ? ['y1', y1] : ['x1', x1];
      const [depKey2, depVal2] = indAx === 'x' ? ['y2', y2] : ['x2', x2];

      // only x1 can be broadcasted when x is the independent variable
      // only y1 can be broadcasted when y is the independent variable
      if (depVal1.type === 'array' || depVal2.type === 'array') {
        throw new Error(`${depKey1} and ${depKey2} must be passed an array of arrays when independentAxis is "${indAx}"`)
      }

      // reject if number of areas per prop are not equal
      const numAreasAll = Object.values(coordinateProps)
        .filter(v => v.type === 'array of arrays')
        .map(v => v.numAreas);

      const numAreasEqual = numAreasAll.every((val, idx, arr) => val === arr[0]);
      if (!numAreasEqual) {
        throw new Error('Number of areas declared per prop must be equal')
      }

      const numAreas = numAreasAll[0];
      return { numAreas, independentAxis, ...normalizedAreas }
    }

    function augmentAreas ({ numAreas, independentAxis, x1, y1, x2, y2 }) {
      const indAx = !independentAxis || independentAxis === 'x' ? 'x' : 'y';
      const [indKey1, indVal1] = indAx === 'x' ? ['x1', x1] : ['y1', y1];
      const [indKey2, indVal2] = indAx === 'x' ? ['x2', x2] : ['y2', y2];
      const [depKey1, depVal1] = indAx === 'x' ? ['y1', y1] : ['x1', x1];
      const [depKey2, depVal2] = indAx === 'x' ? ['y2', y2] : ['x2', x2];

      const indValMap = {
        array: {
          value: Array(numAreas).fill(indVal1.value),
          type: 'array of arrays',
          numAreas: numAreas,
          scaled: indVal1.scaled
        },
        'array of arrays': indVal1
      };

      return {
        numAreas: numAreas,
        independentAxis: indAx,
        [indKey1]: indValMap[indVal1.type],
        [indKey2]: indVal2,
        [depKey1]: depVal1,
        [depKey2]: depVal2
      }
    }

    const markPixelGeometryFuncs = new Proxy({
      Point: createPixelGeometry$6,
      Rectangle: createPixelGeometry$7,
      Polygon: createPixelGeometry$5,
      Line: createPixelGeometry$4,
      Label: createPixelGeometry$6,
      Symbol: createPixelGeometry$3,
      Area: createPixelGeometry$2
    }, {
      get: (obj, prop) => {
        if (prop in obj) {
          return obj[prop]
        } else {
          throw new Error(`Invalid Mark type: '${prop}'`)
        }
      }
    });

    const layerPixelGeometryFuncs = new Proxy({
      Point: createPixelGeometryObject$3,
      Rectangle: createPixelGeometryObject$2,
      Polygon: createPixelGeometry$1,
      Line: createPixelGeometry,
      Label: createPixelGeometryObject$3,
      Symbol: createPixelGeometryObject$1,
      Area: createPixelGeometryObject
    }, {
      get: (obj, prop) => {
        if (prop in obj) {
          return obj[prop]
        } else {
          throw new Error(`Invalid Layer type: '${prop}'`)
        }
      }
    });

    function representLineAsPolygon (lineString, { strokeWidth }) {
      const lineCoordinates = lineString.coordinates;

      if (lineString.type === 'LineString') {
        const outerRing = createOuterRing(lineCoordinates, strokeWidth);

        return {
          type: 'Polygon',
          coordinates: [outerRing]
        }
      }

      if (lineString.type === 'MultiLineString') {
        const polygons = [];

        for (let i = 0; i < lineCoordinates.length; i++) {
          polygons.push(
            [createOuterRing(lineCoordinates[i], strokeWidth)]
          );
        }

        return {
          type: 'MultiPolygon',
          coordinates: polygons
        }
      }
    }

    function createOuterRing (lineCoordinates, strokeWidth) {
      const length = lineCoordinates.length;
      const lastIndex = length - 1;
      const distance = strokeWidth / 2;

      const coordinatesBottom = new Array(length);
      const coordinatesTop = new Array(length);

      for (let i = 0; i < length; i++) {
        if (i === 0) {
          const [bottomPoint, topPoint] = getCornerPointsStart(lineCoordinates, distance);
          coordinatesBottom[0] = bottomPoint;
          coordinatesTop[lastIndex] = topPoint;
        }

        if (i === lastIndex) {
          const [bottomPoint, topPoint] = getCornerPointsEnd(lineCoordinates, distance);
          coordinatesBottom[lastIndex] = bottomPoint;
          coordinatesTop[0] = topPoint;
        }

        if (i > 0 && i < lastIndex) {
          const [bottomPoint, topPoint] = getCornerPointsIndex(lineCoordinates, i, distance);
          coordinatesBottom[i] = bottomPoint;
          coordinatesTop[lastIndex - i] = topPoint;
        }
      }

      const outerRing = coordinatesBottom.concat(coordinatesTop);

      // Close ring if necessary
      if (ringIsNotClosed(outerRing)) {
        outerRing.push(outerRing[0]);
      }

      return outerRing
    }

    function representLinesAsPolygons (lines, { strokeWidthObject }) {
      const polygons = {};

      for (const key in lines) {
        polygons[key] = representLineAsPolygon(lines[key], { strokeWidth: strokeWidthObject[key] });
      }

      return polygons
    }

    function getCornerPointsStart (lineCoordinates, distance) {
      const segment = getNextSegment(0, lineCoordinates);
      const cornerPoint = segment[0];

      return getParallelPoints(segment, cornerPoint, distance)
    }

    function getCornerPointsEnd (lineCoordinates, distance) {
      const segment = getPreviousSegment(lineCoordinates.length - 1, lineCoordinates);
      const cornerPoint = segment[1];

      return getParallelPoints(segment, cornerPoint, distance)
    }

    function getCornerPointsIndex (lineCoordinates, index, distance) {
      const previousSegment = getPreviousSegment(index, lineCoordinates);
      const nextSegment = getNextSegment(index, lineCoordinates);

      const previousUnitVector = getUnitVector(previousSegment);
      const nextUnitVector = getUnitVector(nextSegment);

      if (previousUnitVector[0] === nextUnitVector[0] && previousUnitVector[1] === nextUnitVector[1]) {
        // unit vectors are the same, we can just use the existing line point

        const currentCornerPerpendicularPoints = getParallelPoints(
          previousSegment, previousSegment[1], distance
        );

        return currentCornerPerpendicularPoints
      } else {
        const previousCornerPerpendicularPoints = getParallelPoints(
          previousSegment, previousSegment[0], distance
        );
        const nextCornerPerpendicularPoints = getParallelPoints(
          nextSegment, nextSegment[1], distance
        );

        const bottomPoint = findIntersection(
          previousCornerPerpendicularPoints[0],
          previousUnitVector,
          nextCornerPerpendicularPoints[0],
          nextUnitVector
        );
        const topPoint = findIntersection(
          previousCornerPerpendicularPoints[1],
          previousUnitVector,
          nextCornerPerpendicularPoints[1],
          nextUnitVector
        );

        return [bottomPoint, topPoint]
      }
    }

    const getPreviousSegment = (i, coordinates) => [coordinates[i - 1], coordinates[i]];
    const getNextSegment = (i, coordinates) => [coordinates[i], coordinates[i + 1]];

    function getUnitVector (segment) {
      const [a, b] = segment;

      const magnitude = pointDistance$2(a, b);
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];

      return [dx / magnitude, dy / magnitude]
    }

    const getNormalVector = vector => [-vector[1], vector[0]];

    function movePoint (point, unitVector, distance) {
      return [
        point[0] + unitVector[0] * distance,
        point[1] + unitVector[1] * distance
      ]
    }

    function getParallelPoints (segment, point, distance) {
      const unitVector = getUnitVector(segment);
      const normalVector = getNormalVector(unitVector);

      const bottomPoint = movePoint(point, normalVector, distance);
      const topPoint = movePoint(point, normalVector, -distance);

      return [bottomPoint, topPoint]
    }

    function findIntersection (point1, vector1, point2, vector2) {
      const lambda1 = findLambda(point1, vector1, point2, vector2);
      return [
        point1[0] + (vector1[0] * lambda1),
        point1[1] + (vector1[1] * lambda1)
      ]
    }

    function findLambda (p1, v1, p2, v2) {
      const deltaX = p1[0] - p2[0];
      const deltaY = p1[1] - p2[1];
      const v1x = v1[0];
      const v2x = v2[0];
      const v1y = v1[1];
      const v2y = v2[1];

      const lambda1 = ((v2x * deltaY) - (deltaX * v2y)) /
        ((v1x * v2y) - (v2x * v1y));
      return lambda1
    }

    function ringIsNotClosed (ring) {
      const first = ring[0];
      const last = ring[ring.length - 1];

      const closed = first[0] === last[0] && first[1] === last[1];

      return !closed
    }

    const markRepresentAsPolygonFuncs = {
      Point: representPointAsPolygon,
      Line: representLineAsPolygon
    };

    const layerRepresentAsPolygonFuncs = {
      Point: representPointsAsPolygons,
      Line: representLinesAsPolygons
    };

    function createDataNecessaryForIndexingMark (type, markId, geometryTypes, aesthetics) {
      const markData = { markId };
      let attributes;

      if (type === 'Point') {
        attributes = {
          pixelGeometry: geometryTypes.pixelGeometry,
          radius: aesthetics.radius
        };
      }

      if (type === 'Label') {
        attributes = {
          pixelGeometry: geometryTypes.pixelGeometry,
          radius: aesthetics.fontSize
        };
      }

      if (type === 'Rectangle') {
        attributes = { screenGeometry: geometryTypes.screenGeometry };
      }

      if (type === 'Polygon') {
        attributes = { screenGeometry: geometryTypes.screenGeometry };
      }

      if (type === 'Line') {
        attributes = {
          pixelGeometry: geometryTypes.pixelGeometry,
          strokeWidth: aesthetics.strokeWidth
        };
      }

      if (type === 'Symbol') {
        attributes = { screenGeometry: geometryTypes.screenGeometry };
      }

      if (type === 'Area') {
        attributes = { screenGeometry: geometryTypes.screenGeometry };
      }

      markData.attributes = attributes;

      return markData
    }

    function createDataNecessaryForIndexingLayer (
      type, layerId, keyArray, geometryObjects, aestheticsObjects
    ) {
      const layerData = { layerId, keyArray };
      let layerAttributes;

      if (type === 'Point') {
        layerAttributes = {
          pixelGeometryObject: geometryObjects.pixelGeometryObject,
          radiusObject: aestheticsObjects.radiusObject
        };
      }

      if (type === 'Label') {
        layerAttributes = {
          pixelGeometryObject: geometryObjects.pixelGeometryObject,
          radiusObject: aestheticsObjects.fontSizeObject
        };
      }

      if (type === 'Rectangle') {
        layerAttributes = { screenGeometryObject: geometryObjects.screenGeometryObject };
      }

      if (type === 'Polygon') {
        layerAttributes = { screenGeometryObject: geometryObjects.screenGeometryObject };
      }

      if (type === 'Line') {
        layerAttributes = {
          pixelGeometryObject: geometryObjects.pixelGeometryObject,
          strokeWidthObject: aestheticsObjects.strokeWidthObject
        };
      }

      if (type === 'Symbol') {
        layerAttributes = { screenGeometryObject: geometryObjects.screenGeometryObject };
      }

      if (type === 'Area') {
        layerAttributes = { screenGeometryObject: geometryObjects.screenGeometryObject };
      }

      layerData.layerAttributes = layerAttributes;

      return layerData
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity$4, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /**
     * Returns either a Svelte store, or a Svelte 'tweened' store,
     * depending on whether the user specified transition options.
     * The way the tweened store is set up depends on the type of aesthetic,
     * and which options the user has chosen.
     *
     * @param {String} aestheticName The name of the aesthetic a store is created for.
     * @param {*} aestheticValue The initial value of the store.
     * @param {Number|Object} transitionOptions A number indicating the transtion duration, or an Object
     * with aesthetic names as keys, and Numbers OR Objects as values.
     * @returns {writable|tweened}
     */
    function createTransitionable (aestheticName, aestheticValue, transitionOptions) {
      if (isUndefined(transitionOptions) || isUndefined(aestheticValue)) {
        return writable(aestheticValue)
      }

      if (transitionOptions.constructor === Number) {
        const options = createOptionsFromDuration$1(aestheticName, transitionOptions);
        return tweened(aestheticValue, options)
      }

      if (transitionOptions.constructor === Object) {
        if (!(aestheticName in transitionOptions)) return writable(aestheticValue)

        const aestheticTransition = transitionOptions[aestheticName];

        if (aestheticTransition && aestheticTransition.constructor === Number) {
          const options = createOptionsFromDuration$1(aestheticName, aestheticTransition);
          return tweened(aestheticValue, options)
        }

        if (aestheticTransition && aestheticTransition.constructor === Object) {
          const options = createOptionsFromOptions$1(aestheticName, aestheticTransition);
          return tweened(aestheticValue, options)
        }
      }

      throw new Error(`Invalid transition for ${aestheticName}`)
    }

    function createOptionsFromDuration$1 (aestheticName, duration) {
      if (aestheticName === 'geometry') {
        return { duration, easing: cubicOut, interpolate: transitionGeometry }
      } else {
        return { duration, easing: cubicOut, interpolate: interpolate$2 }
      }
    }

    function transitionsEqual (a, b) {
      if (a === undefined || b === undefined) return a === b

      if (a.constructor !== Object) return a === b

      return transitionObjectsEqual(a, b)
    }

    function transitionObjectsEqual (a, b) {
      if (b.constructor !== Object) return false

      if (numberOfKeys(a) !== numberOfKeys(b)) return false

      for (const aesthetic in a) {
        const aestheticA = a[aesthetic];
        const aestheticB = b[aesthetic];
        if (aestheticA.constructor !== Object) return aestheticA === aestheticB
        if (!aestheticTransitionObjectsEqual(aestheticA, aestheticB)) return false
      }

      return true
    }

    function aestheticTransitionObjectsEqual (a, b) {
      if (b.constructor !== Object) return false

      if (numberOfKeys(a) !== numberOfKeys(b)) return false

      for (const key in a) {
        if (a[key] !== b[key]) return false
      }

      return true
    }

    function numberOfKeys (obj) {
      return Object.keys(obj).length
    }

    function createOptionsFromOptions$1 (aestheticName, transitionOptions) {
      if (aestheticName === 'geometry') {
        const defaultOptions = {
          delay: 0,
          duration: 400,
          easing: cubicOut,
          interpolate: transitionGeometry
        };

        return Object.assign(defaultOptions, transitionOptions)
      } else {
        const defaultOptions = {
          delay: 0,
          duration: 400,
          easing: cubicOut,
          interpolate: interpolate$2
        };

        return Object.assign(defaultOptions, transitionOptions)
      }
    }

    /**
     * Like createTransitionable, returns either a Svelte store, or a Svelte 'tweened' store,
     * depending on whether the user specified transition options.
     * But instead of for a single Mark, the store is created for an entire layer.
     *
     * @param {String} aestheticName The name of the aesthetic a store is created for.
     * @param {*} aestheticValue The initial value of the store.
     * @param {Number|Object} transitionOptions A number indicating the transtion duration, or an Object
     * with aesthetic names as keys, and Numbers OR Objects as values.
     * @returns {writable|tweened}
     */
    function createTransitionableLayer (aestheticName, aestheticValue, transitionOptions) {
      if (isUndefined(transitionOptions) || isUndefined(aestheticValue)) {
        return writable(aestheticValue)
      }

      if (transitionOptions.constructor === Number) {
        const options = createOptionsFromDuration(aestheticName, transitionOptions);
        return tweened(aestheticValue, options)
      }

      if (transitionOptions.constructor === Object) {
        if (!(aestheticName in transitionOptions)) return writable(aestheticValue)

        const aestheticTransition = transitionOptions[aestheticName];

        if (aestheticTransition && aestheticTransition.constructor === Number) {
          const options = createOptionsFromDuration(aestheticName, aestheticTransition);
          return tweened(aestheticValue, options)
        }

        if (aestheticTransition && aestheticTransition.constructor === Object) {
          const options = createOptionsFromOptions(aestheticName, aestheticTransition);
          return tweened(aestheticValue, options)
        }
      }

      throw new Error(`Invalid transition for ${aestheticName}`)
    }

    function createOptionsFromDuration (aestheticName, duration) {
      if (aestheticName === 'geometry') {
        return { duration, easing: cubicOut, interpolate: transitionGeometries }
      } else {
        return { duration, easing: cubicOut, interpolate: interpolateLayer }
      }
    }

    function createOptionsFromOptions (aestheticName, transitionOptions) {
      if (aestheticName === 'geometry') {
        return Object.assign({ interpolate: transitionGeometries }, transitionOptions)
      } else {
        return Object.assign({ interpolate: interpolateLayer }, transitionOptions)
      }
    }

    function interpolateLayer (a, b) {
      const aWithoutObsoleteKeys = {};

      for (const key in a) {
        if (key in b) {
          aWithoutObsoleteKeys[key] = a[key];
        }
      }

      return interpolate$2(aWithoutObsoleteKeys, b)
    }

    function any (...args) {
      for (const arg of args) {
        if (arg !== undefined) return true
      }

      return false
    }

    function parseRenderSettings (renderSettings) {
      const defaultRenderSettings = {
        simplify: false,
        simplificationThreshold: 1,
        interpolate: true,
        interpolationThreshold: 5,
        decimals: 2
      };

      const parsedRenderSettings = Object.assign(defaultRenderSettings, renderSettings);

      return parsedRenderSettings
    }

    const geoPathGenerator = geoPath();

    function generatePath (geometry) {
      return geoPathGenerator(geometry)
    }

    function textAnchorPoint (anchorPoint) {
    // For setting the anchor point on a SVG text element
      switch (anchorPoint) {
        case 'center':
          return { textAnchor: 'middle', dominantBaseline: 'middle' }
        case 'lb':
          return { textAnchor: 'start', dominantBaseline: 'alphabetic' }
        case 'lt':
          return { textAnchor: 'start', dominantBaseline: 'hanging' }
        case 'rt':
          return { textAnchor: 'end', dominantBaseline: 'hanging' }
        case 'rb':
          return { textAnchor: 'end', dominantBaseline: 'alphabetic' }
        case 'l':
          return { textAnchor: 'start', dominantBaseline: 'middle' }
        case 'r':
          return { textAnchor: 'end', dominantBaseline: 'middle' }
        case 'b':
          return { textAnchor: 'middle', dominantBaseline: 'alphabetic' }
        case 't':
          return { textAnchor: 'middle', dominantBaseline: 'hanging' }
        default: {
          return { textAnchor: 'middle', dominantBaseline: 'middle' }
        }
      }
    }

    /* node_modules/@snlab/florence/src/components/Marks/Mark/Mark.svelte generated by Svelte v3.37.0 */
    const file$6 = "node_modules/@snlab/florence/src/components/Marks/Mark/Mark.svelte";

    // (418:0) {#if $graphicContext.output() === 'svg'}
    function create_if_block$3(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let if_block3_anchor;
    	let if_block0 = /*renderPolygon*/ ctx[28] && create_if_block_4$1(ctx);
    	let if_block1 = /*renderCircle*/ ctx[29] && create_if_block_3$1(ctx);
    	let if_block2 = /*renderLine*/ ctx[30] && create_if_block_2$3(ctx);
    	let if_block3 = /*renderLabel*/ ctx[31] && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			if_block3_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block3) if_block3.m(target, anchor);
    			insert_dev(target, if_block3_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*renderPolygon*/ ctx[28]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*renderCircle*/ ctx[29]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*renderLine*/ ctx[30]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$3(ctx);
    					if_block2.c();
    					if_block2.m(t2.parentNode, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*renderLabel*/ ctx[31]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$3(ctx);
    					if_block3.c();
    					if_block3.m(if_block3_anchor.parentNode, if_block3_anchor);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block3) if_block3.d(detaching);
    			if (detaching) detach_dev(if_block3_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(418:0) {#if $graphicContext.output() === 'svg'}",
    		ctx
    	});

    	return block;
    }

    // (420:2) {#if renderPolygon}
    function create_if_block_4$1(ctx) {
    	let path;
    	let path_clip_path_value;
    	let path_class_value;
    	let path_d_value;

    	const block = {
    		c: function create() {
    			path = svg_element("path");

    			attr_dev(path, "clip-path", path_clip_path_value = /*clip*/ ctx[2]
    			? `url(#clip-${/*$sectionContext*/ ctx[15].sectionId})`
    			: "none");

    			attr_dev(path, "class", path_class_value = /*type*/ ctx[0].toLowerCase());
    			attr_dev(path, "d", path_d_value = generatePath(/*$tr_screenGeometry*/ ctx[16]));
    			attr_dev(path, "fill", /*$tr_fill*/ ctx[20]);
    			attr_dev(path, "stroke", /*$tr_stroke*/ ctx[21]);
    			attr_dev(path, "stroke-width", /*$tr_strokeWidth*/ ctx[22]);
    			attr_dev(path, "fill-opacity", /*$tr_fillOpacity*/ ctx[23]);
    			attr_dev(path, "stroke-opacity", /*$tr_strokeOpacity*/ ctx[24]);
    			attr_dev(path, "opacity", /*$tr_opacity*/ ctx[25]);
    			add_location(path, file$6, 421, 4, 13525);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*clip, $sectionContext*/ 32772 && path_clip_path_value !== (path_clip_path_value = /*clip*/ ctx[2]
    			? `url(#clip-${/*$sectionContext*/ ctx[15].sectionId})`
    			: "none")) {
    				attr_dev(path, "clip-path", path_clip_path_value);
    			}

    			if (dirty[0] & /*type*/ 1 && path_class_value !== (path_class_value = /*type*/ ctx[0].toLowerCase())) {
    				attr_dev(path, "class", path_class_value);
    			}

    			if (dirty[0] & /*$tr_screenGeometry*/ 65536 && path_d_value !== (path_d_value = generatePath(/*$tr_screenGeometry*/ ctx[16]))) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty[0] & /*$tr_fill*/ 1048576) {
    				attr_dev(path, "fill", /*$tr_fill*/ ctx[20]);
    			}

    			if (dirty[0] & /*$tr_stroke*/ 2097152) {
    				attr_dev(path, "stroke", /*$tr_stroke*/ ctx[21]);
    			}

    			if (dirty[0] & /*$tr_strokeWidth*/ 4194304) {
    				attr_dev(path, "stroke-width", /*$tr_strokeWidth*/ ctx[22]);
    			}

    			if (dirty[0] & /*$tr_fillOpacity*/ 8388608) {
    				attr_dev(path, "fill-opacity", /*$tr_fillOpacity*/ ctx[23]);
    			}

    			if (dirty[0] & /*$tr_strokeOpacity*/ 16777216) {
    				attr_dev(path, "stroke-opacity", /*$tr_strokeOpacity*/ ctx[24]);
    			}

    			if (dirty[0] & /*$tr_opacity*/ 33554432) {
    				attr_dev(path, "opacity", /*$tr_opacity*/ ctx[25]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(420:2) {#if renderPolygon}",
    		ctx
    	});

    	return block;
    }

    // (436:2) {#if renderCircle}
    function create_if_block_3$1(ctx) {
    	let circle;
    	let circle_clip_path_value;
    	let circle_cx_value;
    	let circle_cy_value;

    	const block = {
    		c: function create() {
    			circle = svg_element("circle");

    			attr_dev(circle, "clip-path", circle_clip_path_value = /*clip*/ ctx[2]
    			? `url(#clip-${/*$sectionContext*/ ctx[15].sectionId})`
    			: "none");

    			attr_dev(circle, "class", "point");
    			attr_dev(circle, "cx", circle_cx_value = /*$tr_screenGeometry*/ ctx[16].coordinates[0]);
    			attr_dev(circle, "cy", circle_cy_value = /*$tr_screenGeometry*/ ctx[16].coordinates[1]);
    			attr_dev(circle, "r", /*$tr_radius*/ ctx[19]);
    			attr_dev(circle, "fill", /*$tr_fill*/ ctx[20]);
    			attr_dev(circle, "stroke", /*$tr_stroke*/ ctx[21]);
    			attr_dev(circle, "stroke-width", /*$tr_strokeWidth*/ ctx[22]);
    			attr_dev(circle, "fill-opacity", /*$tr_fillOpacity*/ ctx[23]);
    			attr_dev(circle, "stroke-opacity", /*$tr_strokeOpacity*/ ctx[24]);
    			attr_dev(circle, "opacity", /*$tr_opacity*/ ctx[25]);
    			add_location(circle, file$6, 437, 4, 13917);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*clip, $sectionContext*/ 32772 && circle_clip_path_value !== (circle_clip_path_value = /*clip*/ ctx[2]
    			? `url(#clip-${/*$sectionContext*/ ctx[15].sectionId})`
    			: "none")) {
    				attr_dev(circle, "clip-path", circle_clip_path_value);
    			}

    			if (dirty[0] & /*$tr_screenGeometry*/ 65536 && circle_cx_value !== (circle_cx_value = /*$tr_screenGeometry*/ ctx[16].coordinates[0])) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty[0] & /*$tr_screenGeometry*/ 65536 && circle_cy_value !== (circle_cy_value = /*$tr_screenGeometry*/ ctx[16].coordinates[1])) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty[0] & /*$tr_radius*/ 524288) {
    				attr_dev(circle, "r", /*$tr_radius*/ ctx[19]);
    			}

    			if (dirty[0] & /*$tr_fill*/ 1048576) {
    				attr_dev(circle, "fill", /*$tr_fill*/ ctx[20]);
    			}

    			if (dirty[0] & /*$tr_stroke*/ 2097152) {
    				attr_dev(circle, "stroke", /*$tr_stroke*/ ctx[21]);
    			}

    			if (dirty[0] & /*$tr_strokeWidth*/ 4194304) {
    				attr_dev(circle, "stroke-width", /*$tr_strokeWidth*/ ctx[22]);
    			}

    			if (dirty[0] & /*$tr_fillOpacity*/ 8388608) {
    				attr_dev(circle, "fill-opacity", /*$tr_fillOpacity*/ ctx[23]);
    			}

    			if (dirty[0] & /*$tr_strokeOpacity*/ 16777216) {
    				attr_dev(circle, "stroke-opacity", /*$tr_strokeOpacity*/ ctx[24]);
    			}

    			if (dirty[0] & /*$tr_opacity*/ 33554432) {
    				attr_dev(circle, "opacity", /*$tr_opacity*/ ctx[25]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(436:2) {#if renderCircle}",
    		ctx
    	});

    	return block;
    }

    // (454:2) {#if renderLine}
    function create_if_block_2$3(ctx) {
    	let path;
    	let path_clip_path_value;
    	let path_d_value;

    	const block = {
    		c: function create() {
    			path = svg_element("path");

    			attr_dev(path, "clip-path", path_clip_path_value = /*clip*/ ctx[2]
    			? `url(#clip-${/*$sectionContext*/ ctx[15].sectionId})`
    			: "none");

    			attr_dev(path, "class", "line");
    			attr_dev(path, "d", path_d_value = generatePath(/*$tr_screenGeometry*/ ctx[16]));
    			attr_dev(path, "fill", "none");
    			attr_dev(path, "stroke-width", /*$tr_strokeWidth*/ ctx[22]);
    			attr_dev(path, "stroke", /*$tr_stroke*/ ctx[21]);
    			attr_dev(path, "opacity", /*$tr_opacity*/ ctx[25]);
    			add_location(path, file$6, 455, 4, 14364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*clip, $sectionContext*/ 32772 && path_clip_path_value !== (path_clip_path_value = /*clip*/ ctx[2]
    			? `url(#clip-${/*$sectionContext*/ ctx[15].sectionId})`
    			: "none")) {
    				attr_dev(path, "clip-path", path_clip_path_value);
    			}

    			if (dirty[0] & /*$tr_screenGeometry*/ 65536 && path_d_value !== (path_d_value = generatePath(/*$tr_screenGeometry*/ ctx[16]))) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty[0] & /*$tr_strokeWidth*/ 4194304) {
    				attr_dev(path, "stroke-width", /*$tr_strokeWidth*/ ctx[22]);
    			}

    			if (dirty[0] & /*$tr_stroke*/ 2097152) {
    				attr_dev(path, "stroke", /*$tr_stroke*/ ctx[21]);
    			}

    			if (dirty[0] & /*$tr_opacity*/ 33554432) {
    				attr_dev(path, "opacity", /*$tr_opacity*/ ctx[25]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(454:2) {#if renderLine}",
    		ctx
    	});

    	return block;
    }

    // (468:2) {#if renderLabel}
    function create_if_block_1$3(ctx) {
    	let g;
    	let text_1;
    	let t_value = /*aesthetics*/ ctx[3].text + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let text_1_font_size_value;
    	let text_1_text_anchor_value;
    	let text_1_dominant_baseline_value;
    	let g_clip_path_value;

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "class", "label");
    			attr_dev(text_1, "x", text_1_x_value = /*$tr_screenGeometry*/ ctx[16].coordinates[0]);
    			attr_dev(text_1, "y", text_1_y_value = /*$tr_screenGeometry*/ ctx[16].coordinates[1]);
    			attr_dev(text_1, "fill", /*$tr_fill*/ ctx[20]);
    			attr_dev(text_1, "stroke", /*$tr_stroke*/ ctx[21]);
    			attr_dev(text_1, "stroke-width", /*$tr_strokeWidth*/ ctx[22]);
    			attr_dev(text_1, "fill-opacity", /*$tr_fillOpacity*/ ctx[23]);
    			attr_dev(text_1, "stroke-opacity", /*$tr_strokeOpacity*/ ctx[24]);
    			attr_dev(text_1, "opacity", /*$tr_opacity*/ ctx[25]);
    			attr_dev(text_1, "transform", /*rotateTransform*/ ctx[17]);
    			attr_dev(text_1, "font-family", /*fontFamily*/ ctx[1]);
    			attr_dev(text_1, "font-size", text_1_font_size_value = /*$tr_fontSize*/ ctx[26] + "px");
    			attr_dev(text_1, "font-weight", /*$tr_fontWeight*/ ctx[27]);
    			attr_dev(text_1, "text-anchor", text_1_text_anchor_value = /*parsedTextAnchorPoint*/ ctx[18].textAnchor);
    			attr_dev(text_1, "dominant-baseline", text_1_dominant_baseline_value = /*parsedTextAnchorPoint*/ ctx[18].dominantBaseline);
    			add_location(text_1, file$6, 474, 6, 14781);

    			attr_dev(g, "clip-path", g_clip_path_value = /*clip*/ ctx[2]
    			? `url(#clip-${/*$sectionContext*/ ctx[15].sectionId})`
    			: "none");

    			attr_dev(g, "class", "label-group");
    			add_location(g, file$6, 469, 4, 14661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			append_dev(g, text_1);
    			append_dev(text_1, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*aesthetics*/ 8 && t_value !== (t_value = /*aesthetics*/ ctx[3].text + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*$tr_screenGeometry*/ 65536 && text_1_x_value !== (text_1_x_value = /*$tr_screenGeometry*/ ctx[16].coordinates[0])) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty[0] & /*$tr_screenGeometry*/ 65536 && text_1_y_value !== (text_1_y_value = /*$tr_screenGeometry*/ ctx[16].coordinates[1])) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty[0] & /*$tr_fill*/ 1048576) {
    				attr_dev(text_1, "fill", /*$tr_fill*/ ctx[20]);
    			}

    			if (dirty[0] & /*$tr_stroke*/ 2097152) {
    				attr_dev(text_1, "stroke", /*$tr_stroke*/ ctx[21]);
    			}

    			if (dirty[0] & /*$tr_strokeWidth*/ 4194304) {
    				attr_dev(text_1, "stroke-width", /*$tr_strokeWidth*/ ctx[22]);
    			}

    			if (dirty[0] & /*$tr_fillOpacity*/ 8388608) {
    				attr_dev(text_1, "fill-opacity", /*$tr_fillOpacity*/ ctx[23]);
    			}

    			if (dirty[0] & /*$tr_strokeOpacity*/ 16777216) {
    				attr_dev(text_1, "stroke-opacity", /*$tr_strokeOpacity*/ ctx[24]);
    			}

    			if (dirty[0] & /*$tr_opacity*/ 33554432) {
    				attr_dev(text_1, "opacity", /*$tr_opacity*/ ctx[25]);
    			}

    			if (dirty[0] & /*rotateTransform*/ 131072) {
    				attr_dev(text_1, "transform", /*rotateTransform*/ ctx[17]);
    			}

    			if (dirty[0] & /*fontFamily*/ 2) {
    				attr_dev(text_1, "font-family", /*fontFamily*/ ctx[1]);
    			}

    			if (dirty[0] & /*$tr_fontSize*/ 67108864 && text_1_font_size_value !== (text_1_font_size_value = /*$tr_fontSize*/ ctx[26] + "px")) {
    				attr_dev(text_1, "font-size", text_1_font_size_value);
    			}

    			if (dirty[0] & /*$tr_fontWeight*/ 134217728) {
    				attr_dev(text_1, "font-weight", /*$tr_fontWeight*/ ctx[27]);
    			}

    			if (dirty[0] & /*parsedTextAnchorPoint*/ 262144 && text_1_text_anchor_value !== (text_1_text_anchor_value = /*parsedTextAnchorPoint*/ ctx[18].textAnchor)) {
    				attr_dev(text_1, "text-anchor", text_1_text_anchor_value);
    			}

    			if (dirty[0] & /*parsedTextAnchorPoint*/ 262144 && text_1_dominant_baseline_value !== (text_1_dominant_baseline_value = /*parsedTextAnchorPoint*/ ctx[18].dominantBaseline)) {
    				attr_dev(text_1, "dominant-baseline", text_1_dominant_baseline_value);
    			}

    			if (dirty[0] & /*clip, $sectionContext*/ 32772 && g_clip_path_value !== (g_clip_path_value = /*clip*/ ctx[2]
    			? `url(#clip-${/*$sectionContext*/ ctx[15].sectionId})`
    			: "none")) {
    				attr_dev(g, "clip-path", g_clip_path_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(468:2) {#if renderLabel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let show_if = /*$graphicContext*/ ctx[32].output() === "svg";
    	let if_block_anchor;
    	let if_block = show_if && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*$graphicContext*/ 2) show_if = /*$graphicContext*/ ctx[32].output() === "svg";

    			if (show_if) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let idCounter$1 = 0;

    function getId$1() {
    	return "mark" + idCounter$1++;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let isInteractiveMouse;
    	let isInteractiveTouch;
    	let isSelectable;
    	let renderPolygon;
    	let renderCircle;
    	let renderLine;
    	let renderLabel;
    	let $sectionContext;

    	let $tr_rotation,
    		$$unsubscribe_tr_rotation = noop$2,
    		$$subscribe_tr_rotation = () => ($$unsubscribe_tr_rotation(), $$unsubscribe_tr_rotation = subscribe$4(tr_rotation, $$value => $$invalidate(80, $tr_rotation = $$value)), tr_rotation);

    	let $tr_screenGeometry,
    		$$unsubscribe_tr_screenGeometry = noop$2,
    		$$subscribe_tr_screenGeometry = () => ($$unsubscribe_tr_screenGeometry(), $$unsubscribe_tr_screenGeometry = subscribe$4(tr_screenGeometry, $$value => $$invalidate(16, $tr_screenGeometry = $$value)), tr_screenGeometry);

    	let $tr_radius,
    		$$unsubscribe_tr_radius = noop$2,
    		$$subscribe_tr_radius = () => ($$unsubscribe_tr_radius(), $$unsubscribe_tr_radius = subscribe$4(tr_radius, $$value => $$invalidate(19, $tr_radius = $$value)), tr_radius);

    	let $tr_fill,
    		$$unsubscribe_tr_fill = noop$2,
    		$$subscribe_tr_fill = () => ($$unsubscribe_tr_fill(), $$unsubscribe_tr_fill = subscribe$4(tr_fill, $$value => $$invalidate(20, $tr_fill = $$value)), tr_fill);

    	let $tr_stroke,
    		$$unsubscribe_tr_stroke = noop$2,
    		$$subscribe_tr_stroke = () => ($$unsubscribe_tr_stroke(), $$unsubscribe_tr_stroke = subscribe$4(tr_stroke, $$value => $$invalidate(21, $tr_stroke = $$value)), tr_stroke);

    	let $tr_strokeWidth,
    		$$unsubscribe_tr_strokeWidth = noop$2,
    		$$subscribe_tr_strokeWidth = () => ($$unsubscribe_tr_strokeWidth(), $$unsubscribe_tr_strokeWidth = subscribe$4(tr_strokeWidth, $$value => $$invalidate(22, $tr_strokeWidth = $$value)), tr_strokeWidth);

    	let $tr_fillOpacity,
    		$$unsubscribe_tr_fillOpacity = noop$2,
    		$$subscribe_tr_fillOpacity = () => ($$unsubscribe_tr_fillOpacity(), $$unsubscribe_tr_fillOpacity = subscribe$4(tr_fillOpacity, $$value => $$invalidate(23, $tr_fillOpacity = $$value)), tr_fillOpacity);

    	let $tr_strokeOpacity,
    		$$unsubscribe_tr_strokeOpacity = noop$2,
    		$$subscribe_tr_strokeOpacity = () => ($$unsubscribe_tr_strokeOpacity(), $$unsubscribe_tr_strokeOpacity = subscribe$4(tr_strokeOpacity, $$value => $$invalidate(24, $tr_strokeOpacity = $$value)), tr_strokeOpacity);

    	let $tr_opacity,
    		$$unsubscribe_tr_opacity = noop$2,
    		$$subscribe_tr_opacity = () => ($$unsubscribe_tr_opacity(), $$unsubscribe_tr_opacity = subscribe$4(tr_opacity, $$value => $$invalidate(25, $tr_opacity = $$value)), tr_opacity);

    	let $tr_fontSize,
    		$$unsubscribe_tr_fontSize = noop$2,
    		$$subscribe_tr_fontSize = () => ($$unsubscribe_tr_fontSize(), $$unsubscribe_tr_fontSize = subscribe$4(tr_fontSize, $$value => $$invalidate(26, $tr_fontSize = $$value)), tr_fontSize);

    	let $tr_fontWeight,
    		$$unsubscribe_tr_fontWeight = noop$2,
    		$$subscribe_tr_fontWeight = () => ($$unsubscribe_tr_fontWeight(), $$unsubscribe_tr_fontWeight = subscribe$4(tr_fontWeight, $$value => $$invalidate(27, $tr_fontWeight = $$value)), tr_fontWeight);

    	let $interactionManagerContext;
    	let $graphicContext;
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_rotation());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_screenGeometry());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_radius());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_fill());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_stroke());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_strokeWidth());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_fillOpacity());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_strokeOpacity());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_opacity());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_fontSize());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_fontWeight());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Mark", slots, []);
    	const markId = getId$1();
    	let initPhase = true;
    	const initDone = () => !initPhase;
    	let { type } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { x1 = undefined } = $$props;
    	let { x2 = undefined } = $$props;
    	let { y1 = undefined } = $$props;
    	let { y2 = undefined } = $$props;
    	let { geometry = undefined } = $$props;
    	let { shape = undefined } = $$props;
    	let { size = undefined } = $$props;
    	let { independentAxis = undefined } = $$props;
    	let { radius = undefined } = $$props;
    	let { fill = undefined } = $$props;
    	let { stroke = undefined } = $$props;
    	let { strokeWidth = undefined } = $$props;
    	let { strokeOpacity = undefined } = $$props;
    	let { fillOpacity = undefined } = $$props;
    	let { opacity = undefined } = $$props;
    	let { text = undefined } = $$props;
    	let { fontFamily = undefined } = $$props;
    	let { fontSize = undefined } = $$props;
    	let { fontWeight = undefined } = $$props;
    	let { rotation = undefined } = $$props;
    	let { anchorPoint = undefined } = $$props;
    	let { transition = undefined } = $$props;
    	let { onClick = undefined } = $$props;
    	let { onMousedown = undefined } = $$props;
    	let { onMouseup = undefined } = $$props;
    	let { onMouseover = undefined } = $$props;
    	let { onMouseout = undefined } = $$props;
    	let { onMousedrag = undefined } = $$props;
    	let { onTouchdown = undefined } = $$props;
    	let { onTouchup = undefined } = $$props;
    	let { onTouchover = undefined } = $$props;
    	let { onTouchout = undefined } = $$props;
    	let { onTouchdrag = undefined } = $$props;
    	let { onSelect = undefined } = $$props;
    	let { onDeselect = undefined } = $$props;
    	let { renderSettings = undefined } = $$props;
    	let { blockReindexing = false } = $$props;
    	let { _asPolygon = true } = $$props;
    	let { clip = true } = $$props;

    	// Validate aesthetics every time input changes
    	let aesthetics = validateAesthetics(type, {
    		x,
    		y,
    		x1,
    		x2,
    		y1,
    		y2,
    		geometry,
    		shape,
    		size,
    		independentAxis,
    		radius,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		text,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		rotation,
    		anchorPoint
    	});

    	// Create 'positioning' aesthetics object
    	let positioningAesthetics = {
    		x,
    		y,
    		x1,
    		x2,
    		y1,
    		y2,
    		geometry,
    		shape,
    		size,
    		independentAxis
    	};

    	// Select appriopriate geometry conversion functions
    	let createPixelGeometry = markPixelGeometryFuncs[type];

    	let representAsPolygon = markRepresentAsPolygonFuncs[type];

    	// Check if mark must be represented as polygon
    	let asPolygon = _asPolygon === true && markRepresentAsPolygonFuncs[type] !== undefined;

    	// Contexts
    	const graphicContext = subscribe$3();

    	validate_store(graphicContext, "graphicContext");
    	component_subscribe($$self, graphicContext, value => $$invalidate(32, $graphicContext = value));
    	const sectionContext = subscribe$2();
    	validate_store(sectionContext, "sectionContext");
    	component_subscribe($$self, sectionContext, value => $$invalidate(15, $sectionContext = value));
    	const interactionManagerContext = subscribe();
    	validate_store(interactionManagerContext, "interactionManagerContext");
    	component_subscribe($$self, interactionManagerContext, value => $$invalidate(89, $interactionManagerContext = value));

    	// Initiate geometries
    	let pixelGeometry;

    	let screenGeometry;
    	updatePixelGeometry();
    	updateScreenGeometry();

    	// Initiate transitionables
    	let tr_screenGeometry = createTransitionable("geometry", screenGeometry, transition);

    	validate_store(tr_screenGeometry, "tr_screenGeometry");
    	$$subscribe_tr_screenGeometry();
    	let tr_radius = createTransitionable("radius", aesthetics.radius, transition);
    	validate_store(tr_radius, "tr_radius");
    	$$subscribe_tr_radius();
    	let tr_fill = createTransitionable("fill", aesthetics.fill, transition);
    	validate_store(tr_fill, "tr_fill");
    	$$subscribe_tr_fill();
    	let tr_stroke = createTransitionable("stroke", aesthetics.stroke, transition);
    	validate_store(tr_stroke, "tr_stroke");
    	$$subscribe_tr_stroke();
    	let tr_strokeWidth = createTransitionable("strokeWidth", aesthetics.strokeWidth, transition);
    	validate_store(tr_strokeWidth, "tr_strokeWidth");
    	$$subscribe_tr_strokeWidth();
    	let tr_fillOpacity = createTransitionable("fillOpacity", aesthetics.fillOpacity, transition);
    	validate_store(tr_fillOpacity, "tr_fillOpacity");
    	$$subscribe_tr_fillOpacity();
    	let tr_strokeOpacity = createTransitionable("strokeOpacity", aesthetics.strokeOpacity, transition);
    	validate_store(tr_strokeOpacity, "tr_strokeOpacity");
    	$$subscribe_tr_strokeOpacity();
    	let tr_opacity = createTransitionable("opacity", aesthetics.opacity, transition);
    	validate_store(tr_opacity, "tr_opacity");
    	$$subscribe_tr_opacity();

    	// text transtitionables
    	let tr_fontSize = createTransitionable("fontSize", aesthetics.fontSize, transition);

    	validate_store(tr_fontSize, "tr_fontSize");
    	$$subscribe_tr_fontSize();
    	let tr_fontWeight = createTransitionable("fontWeight", aesthetics.fontWeight, transition);
    	validate_store(tr_fontWeight, "tr_fontWeight");
    	$$subscribe_tr_fontWeight();
    	let tr_rotation = createTransitionable("rotation", aesthetics.rotation, transition);
    	validate_store(tr_rotation, "tr_rotation");
    	$$subscribe_tr_rotation();

    	// non-transitionable aesthetics that need additional calculation
    	let rotateTransform = `rotate(${$tr_rotation}, ${$tr_screenGeometry.coordinates[0]}, ${$tr_screenGeometry.coordinates[1]})`;

    	let parsedTextAnchorPoint = textAnchorPoint(aesthetics.anchorPoint);
    	let previousTransition;
    	let pixelGeometryRecalculationNecessary = false;
    	let screenGeometryRecalculationNecessary = false;
    	

    	// Update transitionables when transition settings change
    	beforeUpdate(() => {
    		if (!transitionsEqual(previousTransition, transition)) {
    			previousTransition = transition;
    			$$subscribe_tr_screenGeometry($$invalidate(4, tr_screenGeometry = createTransitionable("geometry", $tr_screenGeometry, transition)));
    			$$subscribe_tr_radius($$invalidate(5, tr_radius = createTransitionable("radius", $tr_radius, transition)));
    			$$subscribe_tr_fill($$invalidate(6, tr_fill = createTransitionable("fill", $tr_fill, transition)));
    			$$subscribe_tr_stroke($$invalidate(7, tr_stroke = createTransitionable("stroke", $tr_stroke, transition)));
    			$$subscribe_tr_strokeWidth($$invalidate(8, tr_strokeWidth = createTransitionable("strokeWidth", $tr_strokeWidth, transition)));
    			$$subscribe_tr_fillOpacity($$invalidate(9, tr_fillOpacity = createTransitionable("fillOpacity", $tr_fillOpacity, transition)));
    			$$subscribe_tr_strokeOpacity($$invalidate(10, tr_strokeOpacity = createTransitionable("strokeOpacity", $tr_strokeOpacity, transition)));
    			$$subscribe_tr_opacity($$invalidate(11, tr_opacity = createTransitionable("opacity", $tr_opacity, transition)));
    			$$subscribe_tr_fontSize($$invalidate(12, tr_fontSize = createTransitionable("fontSize", $tr_fontSize, transition)));
    			$$subscribe_tr_fontWeight($$invalidate(13, tr_fontWeight = createTransitionable("fontWeight", $tr_fontWeight, transition)));
    			$$subscribe_tr_rotation($$invalidate(14, tr_rotation = createTransitionable("rotation", $tr_rotation, transition)));
    		}
    	});

    	afterUpdate(() => {
    		initPhase = false;
    	});

    	onMount(() => {
    		updateInteractionManagerIfNecessary();
    	});

    	onDestroy(() => {
    		removeMarkFromSpatialIndexIfNecessary();
    	});

    	// Helpers
    	function scheduleUpdatePixelGeometry() {
    		$$invalidate(78, pixelGeometryRecalculationNecessary = true);
    		$$invalidate(79, screenGeometryRecalculationNecessary = true);
    	}

    	function updatePixelGeometry() {
    		pixelGeometry = createPixelGeometry(positioningAesthetics, $sectionContext, parseRenderSettings(renderSettings));
    	}

    	function scheduleUpdateScreenGeometry() {
    		$$invalidate(79, screenGeometryRecalculationNecessary = true);
    	}

    	function updateScreenGeometry() {
    		if (asPolygon) {
    			$$invalidate(77, screenGeometry = representAsPolygon(pixelGeometry, aesthetics));
    		} else {
    			$$invalidate(77, screenGeometry = pixelGeometry);
    		}
    	}

    	function updateInteractionManagerIfNecessary() {
    		if (initPhase || !(blockReindexing || $sectionContext.blockReindexing)) {
    			removeMarkFromSpatialIndexIfNecessary();

    			if (isInteractiveMouse) {
    				const markInterface = $interactionManagerContext.mouse().marks();
    				markInterface.loadMark(type, createDataNecessaryForIndexing());
    				if (onClick) markInterface.addMarkInteraction("click", markId, onClick);
    				if (onMousedown) markInterface.addMarkInteraction("mousedown", markId, onMousedown);
    				if (onMouseup) markInterface.addMarkInteraction("mouseup", markId, onMouseup);
    				if (onMouseout) markInterface.addMarkInteraction("mouseout", markId, onMouseout);
    				if (onMouseover) markInterface.addMarkInteraction("mouseover", markId, onMouseover);
    				if (onMousedrag) markInterface.addMarkInteraction("mousedrag", markId, onMousedrag);
    			}

    			if (isInteractiveTouch) {
    				const markInterface = $interactionManagerContext.touch().marks();
    				markInterface.loadMark(type, createDataNecessaryForIndexing());
    				if (onTouchdown) markInterface.addMarkInteraction("touchdown", markId, onTouchdown);
    				if (onTouchup) markInterface.addMarkInteraction("touchup", markId, onTouchup);
    				if (onTouchover) markInterface.addMarkInteraction("touchover", markId, onTouchover);
    				if (onTouchout) markInterface.addMarkInteraction("touchout", markId, onTouchout);
    				if (onTouchdrag) markInterface.addMarkInteraction("touchdrag", markId, onTouchdrag);
    			}
    		}

    		removeMarkFromSelectIfNecessary();

    		if (isSelectable) {
    			const selectManager = $interactionManagerContext.select();
    			selectManager.loadMark(type, createDataNecessaryForIndexing(), { onSelect, onDeselect });
    		}
    	}

    	function removeMarkFromSpatialIndexIfNecessary() {
    		if (primaryInput === "mouse") {
    			const markMouseInterface = $interactionManagerContext.mouse().marks();

    			if (markMouseInterface.markIsLoaded(markId)) {
    				markMouseInterface.removeAllMarkInteractions(markId);
    				markMouseInterface.removeMark(markId);
    			}
    		}

    		if (primaryInput === "touch") {
    			const markTouchInterface = $interactionManagerContext.touch().marks();

    			if (markTouchInterface.markIsLoaded(markId)) {
    				markTouchInterface.removeAllMarkInteractions(markId);
    				markTouchInterface.removeMark(markId);
    			}
    		}
    	}

    	function removeMarkFromSelectIfNecessary() {
    		const selectManager = $interactionManagerContext.select();

    		if (selectManager.markIsLoaded(markId)) {
    			selectManager.removeMark(markId);
    		}
    	}

    	function createDataNecessaryForIndexing() {
    		return createDataNecessaryForIndexingMark(type, markId, { screenGeometry, pixelGeometry }, aesthetics);
    	}

    	const writable_props = [
    		"type",
    		"x",
    		"y",
    		"x1",
    		"x2",
    		"y1",
    		"y2",
    		"geometry",
    		"shape",
    		"size",
    		"independentAxis",
    		"radius",
    		"fill",
    		"stroke",
    		"strokeWidth",
    		"strokeOpacity",
    		"fillOpacity",
    		"opacity",
    		"text",
    		"fontFamily",
    		"fontSize",
    		"fontWeight",
    		"rotation",
    		"anchorPoint",
    		"transition",
    		"onClick",
    		"onMousedown",
    		"onMouseup",
    		"onMouseover",
    		"onMouseout",
    		"onMousedrag",
    		"onTouchdown",
    		"onTouchup",
    		"onTouchover",
    		"onTouchout",
    		"onTouchdrag",
    		"onSelect",
    		"onDeselect",
    		"renderSettings",
    		"blockReindexing",
    		"_asPolygon",
    		"clip"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Mark> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("x" in $$props) $$invalidate(36, x = $$props.x);
    		if ("y" in $$props) $$invalidate(37, y = $$props.y);
    		if ("x1" in $$props) $$invalidate(38, x1 = $$props.x1);
    		if ("x2" in $$props) $$invalidate(39, x2 = $$props.x2);
    		if ("y1" in $$props) $$invalidate(40, y1 = $$props.y1);
    		if ("y2" in $$props) $$invalidate(41, y2 = $$props.y2);
    		if ("geometry" in $$props) $$invalidate(42, geometry = $$props.geometry);
    		if ("shape" in $$props) $$invalidate(43, shape = $$props.shape);
    		if ("size" in $$props) $$invalidate(44, size = $$props.size);
    		if ("independentAxis" in $$props) $$invalidate(45, independentAxis = $$props.independentAxis);
    		if ("radius" in $$props) $$invalidate(46, radius = $$props.radius);
    		if ("fill" in $$props) $$invalidate(47, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(48, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(49, strokeWidth = $$props.strokeWidth);
    		if ("strokeOpacity" in $$props) $$invalidate(50, strokeOpacity = $$props.strokeOpacity);
    		if ("fillOpacity" in $$props) $$invalidate(51, fillOpacity = $$props.fillOpacity);
    		if ("opacity" in $$props) $$invalidate(52, opacity = $$props.opacity);
    		if ("text" in $$props) $$invalidate(53, text = $$props.text);
    		if ("fontFamily" in $$props) $$invalidate(1, fontFamily = $$props.fontFamily);
    		if ("fontSize" in $$props) $$invalidate(54, fontSize = $$props.fontSize);
    		if ("fontWeight" in $$props) $$invalidate(55, fontWeight = $$props.fontWeight);
    		if ("rotation" in $$props) $$invalidate(56, rotation = $$props.rotation);
    		if ("anchorPoint" in $$props) $$invalidate(57, anchorPoint = $$props.anchorPoint);
    		if ("transition" in $$props) $$invalidate(58, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(59, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(60, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(61, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(62, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(63, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(64, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(65, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(66, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(67, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(68, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(69, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(70, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(71, onDeselect = $$props.onDeselect);
    		if ("renderSettings" in $$props) $$invalidate(72, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(73, blockReindexing = $$props.blockReindexing);
    		if ("_asPolygon" in $$props) $$invalidate(74, _asPolygon = $$props._asPolygon);
    		if ("clip" in $$props) $$invalidate(2, clip = $$props.clip);
    	};

    	$$self.$capture_state = () => ({
    		idCounter: idCounter$1,
    		getId: getId$1,
    		beforeUpdate,
    		afterUpdate,
    		onMount,
    		onDestroy,
    		detectIt,
    		GraphicContext: GraphicContext$1,
    		SectionContext,
    		InteractionManagerContext,
    		validateAesthetics,
    		markPixelGeometryFuncs,
    		markRepresentAsPolygonFuncs,
    		createDataNecessaryForIndexingMark,
    		createTransitionable,
    		transitionsEqual,
    		any,
    		parseRenderSettings,
    		generatePath,
    		textAnchorPoint,
    		markId,
    		initPhase,
    		initDone,
    		type,
    		x,
    		y,
    		x1,
    		x2,
    		y1,
    		y2,
    		geometry,
    		shape,
    		size,
    		independentAxis,
    		radius,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		text,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		rotation,
    		anchorPoint,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		renderSettings,
    		blockReindexing,
    		_asPolygon,
    		clip,
    		aesthetics,
    		positioningAesthetics,
    		createPixelGeometry,
    		representAsPolygon,
    		asPolygon,
    		graphicContext,
    		sectionContext,
    		interactionManagerContext,
    		pixelGeometry,
    		screenGeometry,
    		tr_screenGeometry,
    		tr_radius,
    		tr_fill,
    		tr_stroke,
    		tr_strokeWidth,
    		tr_fillOpacity,
    		tr_strokeOpacity,
    		tr_opacity,
    		tr_fontSize,
    		tr_fontWeight,
    		tr_rotation,
    		rotateTransform,
    		parsedTextAnchorPoint,
    		previousTransition,
    		pixelGeometryRecalculationNecessary,
    		screenGeometryRecalculationNecessary,
    		scheduleUpdatePixelGeometry,
    		updatePixelGeometry,
    		scheduleUpdateScreenGeometry,
    		updateScreenGeometry,
    		updateInteractionManagerIfNecessary,
    		removeMarkFromSpatialIndexIfNecessary,
    		removeMarkFromSelectIfNecessary,
    		createDataNecessaryForIndexing,
    		$sectionContext,
    		$tr_rotation,
    		$tr_screenGeometry,
    		$tr_radius,
    		$tr_fill,
    		$tr_stroke,
    		$tr_strokeWidth,
    		$tr_fillOpacity,
    		$tr_strokeOpacity,
    		$tr_opacity,
    		$tr_fontSize,
    		$tr_fontWeight,
    		isInteractiveMouse,
    		isInteractiveTouch,
    		isSelectable,
    		$interactionManagerContext,
    		renderPolygon,
    		renderCircle,
    		renderLine,
    		renderLabel,
    		$graphicContext
    	});

    	$$self.$inject_state = $$props => {
    		if ("initPhase" in $$props) initPhase = $$props.initPhase;
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("x" in $$props) $$invalidate(36, x = $$props.x);
    		if ("y" in $$props) $$invalidate(37, y = $$props.y);
    		if ("x1" in $$props) $$invalidate(38, x1 = $$props.x1);
    		if ("x2" in $$props) $$invalidate(39, x2 = $$props.x2);
    		if ("y1" in $$props) $$invalidate(40, y1 = $$props.y1);
    		if ("y2" in $$props) $$invalidate(41, y2 = $$props.y2);
    		if ("geometry" in $$props) $$invalidate(42, geometry = $$props.geometry);
    		if ("shape" in $$props) $$invalidate(43, shape = $$props.shape);
    		if ("size" in $$props) $$invalidate(44, size = $$props.size);
    		if ("independentAxis" in $$props) $$invalidate(45, independentAxis = $$props.independentAxis);
    		if ("radius" in $$props) $$invalidate(46, radius = $$props.radius);
    		if ("fill" in $$props) $$invalidate(47, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(48, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(49, strokeWidth = $$props.strokeWidth);
    		if ("strokeOpacity" in $$props) $$invalidate(50, strokeOpacity = $$props.strokeOpacity);
    		if ("fillOpacity" in $$props) $$invalidate(51, fillOpacity = $$props.fillOpacity);
    		if ("opacity" in $$props) $$invalidate(52, opacity = $$props.opacity);
    		if ("text" in $$props) $$invalidate(53, text = $$props.text);
    		if ("fontFamily" in $$props) $$invalidate(1, fontFamily = $$props.fontFamily);
    		if ("fontSize" in $$props) $$invalidate(54, fontSize = $$props.fontSize);
    		if ("fontWeight" in $$props) $$invalidate(55, fontWeight = $$props.fontWeight);
    		if ("rotation" in $$props) $$invalidate(56, rotation = $$props.rotation);
    		if ("anchorPoint" in $$props) $$invalidate(57, anchorPoint = $$props.anchorPoint);
    		if ("transition" in $$props) $$invalidate(58, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(59, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(60, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(61, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(62, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(63, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(64, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(65, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(66, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(67, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(68, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(69, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(70, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(71, onDeselect = $$props.onDeselect);
    		if ("renderSettings" in $$props) $$invalidate(72, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(73, blockReindexing = $$props.blockReindexing);
    		if ("_asPolygon" in $$props) $$invalidate(74, _asPolygon = $$props._asPolygon);
    		if ("clip" in $$props) $$invalidate(2, clip = $$props.clip);
    		if ("aesthetics" in $$props) $$invalidate(3, aesthetics = $$props.aesthetics);
    		if ("positioningAesthetics" in $$props) $$invalidate(75, positioningAesthetics = $$props.positioningAesthetics);
    		if ("createPixelGeometry" in $$props) createPixelGeometry = $$props.createPixelGeometry;
    		if ("representAsPolygon" in $$props) representAsPolygon = $$props.representAsPolygon;
    		if ("asPolygon" in $$props) $$invalidate(76, asPolygon = $$props.asPolygon);
    		if ("pixelGeometry" in $$props) pixelGeometry = $$props.pixelGeometry;
    		if ("screenGeometry" in $$props) $$invalidate(77, screenGeometry = $$props.screenGeometry);
    		if ("tr_screenGeometry" in $$props) $$subscribe_tr_screenGeometry($$invalidate(4, tr_screenGeometry = $$props.tr_screenGeometry));
    		if ("tr_radius" in $$props) $$subscribe_tr_radius($$invalidate(5, tr_radius = $$props.tr_radius));
    		if ("tr_fill" in $$props) $$subscribe_tr_fill($$invalidate(6, tr_fill = $$props.tr_fill));
    		if ("tr_stroke" in $$props) $$subscribe_tr_stroke($$invalidate(7, tr_stroke = $$props.tr_stroke));
    		if ("tr_strokeWidth" in $$props) $$subscribe_tr_strokeWidth($$invalidate(8, tr_strokeWidth = $$props.tr_strokeWidth));
    		if ("tr_fillOpacity" in $$props) $$subscribe_tr_fillOpacity($$invalidate(9, tr_fillOpacity = $$props.tr_fillOpacity));
    		if ("tr_strokeOpacity" in $$props) $$subscribe_tr_strokeOpacity($$invalidate(10, tr_strokeOpacity = $$props.tr_strokeOpacity));
    		if ("tr_opacity" in $$props) $$subscribe_tr_opacity($$invalidate(11, tr_opacity = $$props.tr_opacity));
    		if ("tr_fontSize" in $$props) $$subscribe_tr_fontSize($$invalidate(12, tr_fontSize = $$props.tr_fontSize));
    		if ("tr_fontWeight" in $$props) $$subscribe_tr_fontWeight($$invalidate(13, tr_fontWeight = $$props.tr_fontWeight));
    		if ("tr_rotation" in $$props) $$subscribe_tr_rotation($$invalidate(14, tr_rotation = $$props.tr_rotation));
    		if ("rotateTransform" in $$props) $$invalidate(17, rotateTransform = $$props.rotateTransform);
    		if ("parsedTextAnchorPoint" in $$props) $$invalidate(18, parsedTextAnchorPoint = $$props.parsedTextAnchorPoint);
    		if ("previousTransition" in $$props) previousTransition = $$props.previousTransition;
    		if ("pixelGeometryRecalculationNecessary" in $$props) $$invalidate(78, pixelGeometryRecalculationNecessary = $$props.pixelGeometryRecalculationNecessary);
    		if ("screenGeometryRecalculationNecessary" in $$props) $$invalidate(79, screenGeometryRecalculationNecessary = $$props.screenGeometryRecalculationNecessary);
    		if ("isInteractiveMouse" in $$props) isInteractiveMouse = $$props.isInteractiveMouse;
    		if ("isInteractiveTouch" in $$props) isInteractiveTouch = $$props.isInteractiveTouch;
    		if ("isSelectable" in $$props) isSelectable = $$props.isSelectable;
    		if ("renderPolygon" in $$props) $$invalidate(28, renderPolygon = $$props.renderPolygon);
    		if ("renderCircle" in $$props) $$invalidate(29, renderCircle = $$props.renderCircle);
    		if ("renderLine" in $$props) $$invalidate(30, renderLine = $$props.renderLine);
    		if ("renderLabel" in $$props) $$invalidate(31, renderLabel = $$props.renderLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type, fontFamily*/ 3 | $$self.$$.dirty[1] & /*x, y, x1, x2, y1, y2, geometry, shape, size, independentAxis, radius, fill, stroke, strokeWidth, strokeOpacity, fillOpacity, opacity, text, fontSize, fontWeight, rotation, anchorPoint*/ 134217696) {
    			{
    				if (initDone()) {
    					$$invalidate(3, aesthetics = validateAesthetics(type, {
    						x,
    						y,
    						x1,
    						x2,
    						y1,
    						y2,
    						geometry,
    						shape,
    						size,
    						independentAxis,
    						radius,
    						fill,
    						stroke,
    						strokeWidth,
    						strokeOpacity,
    						fillOpacity,
    						opacity,
    						text,
    						fontFamily,
    						fontSize,
    						fontWeight,
    						rotation,
    						anchorPoint
    					}));
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*x, y, x1, x2, y1, y2, geometry, shape, size, independentAxis*/ 32736) {
    			{
    				if (initDone()) {
    					$$invalidate(75, positioningAesthetics = {
    						x,
    						y,
    						x1,
    						x2,
    						y1,
    						y2,
    						geometry,
    						shape,
    						size,
    						independentAxis
    					});
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1) {
    			{
    				if (initDone()) {
    					createPixelGeometry = markPixelGeometryFuncs[type];
    					representAsPolygon = markRepresentAsPolygonFuncs[type];
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1 | $$self.$$.dirty[2] & /*_asPolygon*/ 4096) {
    			{
    				if (initDone()) {
    					$$invalidate(76, asPolygon = _asPolygon === true && markRepresentAsPolygonFuncs[type] !== undefined);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$sectionContext*/ 32768 | $$self.$$.dirty[2] & /*positioningAesthetics, renderSettings*/ 9216) {
    			// Handle changes to geometry
    			{
    				if (initDone()) {
    					scheduleUpdatePixelGeometry(positioningAesthetics, $sectionContext, parseRenderSettings(renderSettings));
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_radius, aesthetics, tr_strokeWidth*/ 296 | $$self.$$.dirty[2] & /*asPolygon*/ 16384) {
    			// Handle radius and strokeWidth changes if Point or Line is not represented as Polygon
    			{
    				if (initDone()) {
    					if (!asPolygon) {
    						tr_radius.set(aesthetics.radius);
    						tr_strokeWidth.set(aesthetics.strokeWidth);
    					}

    					if (asPolygon) {
    						scheduleUpdateScreenGeometry();
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_fill, aesthetics*/ 72) {
    			// Handle other changes
    			{
    				if (initDone()) tr_fill.set(aesthetics.fill);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_stroke, aesthetics*/ 136) {
    			{
    				if (initDone()) tr_stroke.set(aesthetics.stroke);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_strokeWidth, aesthetics*/ 264) {
    			{
    				if (initDone()) tr_strokeWidth.set(aesthetics.strokeWidth);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_fillOpacity, aesthetics*/ 520) {
    			{
    				if (initDone()) tr_fillOpacity.set(aesthetics.fillOpacity);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_strokeOpacity, aesthetics*/ 1032) {
    			{
    				if (initDone()) tr_strokeOpacity.set(aesthetics.strokeOpacity);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_opacity, aesthetics*/ 2056) {
    			{
    				if (initDone()) tr_opacity.set(aesthetics.opacity);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_fontSize, aesthetics*/ 4104) {
    			// text aes changes
    			{
    				if (initDone()) tr_fontSize.set(aesthetics.fontSize);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_fontWeight, aesthetics*/ 8200) {
    			{
    				if (initDone()) tr_fontWeight.set(aesthetics.fontWeight);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_rotation, aesthetics*/ 16392) {
    			{
    				if (initDone()) tr_rotation.set(aesthetics.rotation);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_screenGeometry*/ 16 | $$self.$$.dirty[2] & /*pixelGeometryRecalculationNecessary, screenGeometryRecalculationNecessary, screenGeometry*/ 229376) {
    			{
    				if (initDone()) {
    					if (pixelGeometryRecalculationNecessary) updatePixelGeometry();

    					if (screenGeometryRecalculationNecessary) {
    						updateScreenGeometry();
    						tr_screenGeometry.set(screenGeometry);
    						updateInteractionManagerIfNecessary();
    					}

    					$$invalidate(78, pixelGeometryRecalculationNecessary = false);
    					$$invalidate(79, screenGeometryRecalculationNecessary = false);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$tr_screenGeometry*/ 65536 | $$self.$$.dirty[2] & /*$tr_rotation*/ 262144) {
    			{
    				if (initDone()) $$invalidate(17, rotateTransform = `rotate(${$tr_rotation}, ${$tr_screenGeometry.coordinates[0]}, ${$tr_screenGeometry.coordinates[1]})`);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*aesthetics*/ 8) {
    			{
    				if (initDone()) $$invalidate(18, parsedTextAnchorPoint = textAnchorPoint(aesthetics.anchorPoint));
    			}
    		}

    		if ($$self.$$.dirty[1] & /*onClick, onMousedown, onMouseup*/ 1879048192 | $$self.$$.dirty[2] & /*onMouseover, onMouseout, onMousedrag*/ 7) {
    			// Interactivity
    			isInteractiveMouse = primaryInput === "mouse" && any(onClick, onMousedown, onMouseup, onMouseover, onMouseout, onMousedrag);
    		}

    		if ($$self.$$.dirty[2] & /*onTouchdown, onTouchup, onTouchover, onTouchout, onTouchdrag*/ 248) {
    			isInteractiveTouch = primaryInput === "touch" && any(onTouchdown, onTouchup, onTouchover, onTouchout, onTouchdrag);
    		}

    		if ($$self.$$.dirty[2] & /*onSelect, onDeselect*/ 768) {
    			isSelectable = onSelect !== undefined || onDeselect !== undefined;
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1 | $$self.$$.dirty[2] & /*asPolygon*/ 16384) {
    			$$invalidate(28, renderPolygon = !["Point", "Line", "Label"].includes(type) || asPolygon);
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1 | $$self.$$.dirty[2] & /*asPolygon*/ 16384) {
    			$$invalidate(29, renderCircle = type === "Point" && !asPolygon);
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1 | $$self.$$.dirty[2] & /*asPolygon*/ 16384) {
    			$$invalidate(30, renderLine = type === "Line" && !asPolygon);
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1) {
    			$$invalidate(31, renderLabel = type === "Label");
    		}
    	};

    	return [
    		type,
    		fontFamily,
    		clip,
    		aesthetics,
    		tr_screenGeometry,
    		tr_radius,
    		tr_fill,
    		tr_stroke,
    		tr_strokeWidth,
    		tr_fillOpacity,
    		tr_strokeOpacity,
    		tr_opacity,
    		tr_fontSize,
    		tr_fontWeight,
    		tr_rotation,
    		$sectionContext,
    		$tr_screenGeometry,
    		rotateTransform,
    		parsedTextAnchorPoint,
    		$tr_radius,
    		$tr_fill,
    		$tr_stroke,
    		$tr_strokeWidth,
    		$tr_fillOpacity,
    		$tr_strokeOpacity,
    		$tr_opacity,
    		$tr_fontSize,
    		$tr_fontWeight,
    		renderPolygon,
    		renderCircle,
    		renderLine,
    		renderLabel,
    		$graphicContext,
    		graphicContext,
    		sectionContext,
    		interactionManagerContext,
    		x,
    		y,
    		x1,
    		x2,
    		y1,
    		y2,
    		geometry,
    		shape,
    		size,
    		independentAxis,
    		radius,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		text,
    		fontSize,
    		fontWeight,
    		rotation,
    		anchorPoint,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		renderSettings,
    		blockReindexing,
    		_asPolygon,
    		positioningAesthetics,
    		asPolygon,
    		screenGeometry,
    		pixelGeometryRecalculationNecessary,
    		screenGeometryRecalculationNecessary,
    		$tr_rotation
    	];
    }

    class Mark extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(
    			this,
    			options,
    			instance$b,
    			create_fragment$b,
    			safe_not_equal,
    			{
    				type: 0,
    				x: 36,
    				y: 37,
    				x1: 38,
    				x2: 39,
    				y1: 40,
    				y2: 41,
    				geometry: 42,
    				shape: 43,
    				size: 44,
    				independentAxis: 45,
    				radius: 46,
    				fill: 47,
    				stroke: 48,
    				strokeWidth: 49,
    				strokeOpacity: 50,
    				fillOpacity: 51,
    				opacity: 52,
    				text: 53,
    				fontFamily: 1,
    				fontSize: 54,
    				fontWeight: 55,
    				rotation: 56,
    				anchorPoint: 57,
    				transition: 58,
    				onClick: 59,
    				onMousedown: 60,
    				onMouseup: 61,
    				onMouseover: 62,
    				onMouseout: 63,
    				onMousedrag: 64,
    				onTouchdown: 65,
    				onTouchup: 66,
    				onTouchover: 67,
    				onTouchout: 68,
    				onTouchdrag: 69,
    				onSelect: 70,
    				onDeselect: 71,
    				renderSettings: 72,
    				blockReindexing: 73,
    				_asPolygon: 74,
    				clip: 2
    			},
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Mark",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*type*/ ctx[0] === undefined && !("type" in props)) {
    			console.warn("<Mark> was created without expected prop 'type'");
    		}
    	}

    	get type() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x1() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x1(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x2() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x2(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y1() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y1(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y2() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y2(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get geometry() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set geometry(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shape() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shape(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get independentAxis() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set independentAxis(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radius() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radius(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeOpacity() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeOpacity(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fillOpacity() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fillOpacity(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontFamily() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontFamily(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontSize() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontSize(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontWeight() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontWeight(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotation() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotation(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchorPoint() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchorPoint(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedown() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedown(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseup() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseup(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseover() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseover(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseout() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseout(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedrag() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedrag(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdown() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdown(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchup() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchup(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchover() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchover(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchout() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchout(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdrag() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdrag(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSelect() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSelect(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDeselect() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDeselect(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderSettings() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderSettings(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blockReindexing() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blockReindexing(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get _asPolygon() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set _asPolygon(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clip() {
    		throw new Error("<Mark>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clip(value) {
    		throw new Error("<Mark>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@snlab/florence/src/components/Marks/Point/Point.svelte generated by Svelte v3.37.0 */

    function create_fragment$a(ctx) {
    	let mark;
    	let current;

    	mark = new Mark({
    			props: {
    				type: "Point",
    				x: /*x*/ ctx[0],
    				y: /*y*/ ctx[1],
    				geometry: /*geometry*/ ctx[2],
    				radius: /*radius*/ ctx[3],
    				fill: /*fill*/ ctx[4],
    				stroke: /*stroke*/ ctx[5],
    				strokeWidth: /*strokeWidth*/ ctx[6],
    				strokeOpacity: /*strokeOpacity*/ ctx[7],
    				fillOpacity: /*fillOpacity*/ ctx[8],
    				opacity: /*opacity*/ ctx[9],
    				transition: /*transition*/ ctx[10],
    				onClick: /*onClick*/ ctx[11],
    				onMousedown: /*onMousedown*/ ctx[12],
    				onMouseup: /*onMouseup*/ ctx[13],
    				onMouseover: /*onMouseover*/ ctx[14],
    				onMouseout: /*onMouseout*/ ctx[15],
    				onMousedrag: /*onMousedrag*/ ctx[16],
    				onTouchdown: /*onTouchdown*/ ctx[17],
    				onTouchup: /*onTouchup*/ ctx[18],
    				onTouchover: /*onTouchover*/ ctx[19],
    				onTouchout: /*onTouchout*/ ctx[20],
    				onTouchdrag: /*onTouchdrag*/ ctx[21],
    				onSelect: /*onSelect*/ ctx[22],
    				onDeselect: /*onDeselect*/ ctx[23],
    				renderSettings: /*renderSettings*/ ctx[24],
    				blockReindexing: /*blockReindexing*/ ctx[25],
    				clip: /*clip*/ ctx[26],
    				_asPolygon: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mark.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(mark, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const mark_changes = {};
    			if (dirty & /*x*/ 1) mark_changes.x = /*x*/ ctx[0];
    			if (dirty & /*y*/ 2) mark_changes.y = /*y*/ ctx[1];
    			if (dirty & /*geometry*/ 4) mark_changes.geometry = /*geometry*/ ctx[2];
    			if (dirty & /*radius*/ 8) mark_changes.radius = /*radius*/ ctx[3];
    			if (dirty & /*fill*/ 16) mark_changes.fill = /*fill*/ ctx[4];
    			if (dirty & /*stroke*/ 32) mark_changes.stroke = /*stroke*/ ctx[5];
    			if (dirty & /*strokeWidth*/ 64) mark_changes.strokeWidth = /*strokeWidth*/ ctx[6];
    			if (dirty & /*strokeOpacity*/ 128) mark_changes.strokeOpacity = /*strokeOpacity*/ ctx[7];
    			if (dirty & /*fillOpacity*/ 256) mark_changes.fillOpacity = /*fillOpacity*/ ctx[8];
    			if (dirty & /*opacity*/ 512) mark_changes.opacity = /*opacity*/ ctx[9];
    			if (dirty & /*transition*/ 1024) mark_changes.transition = /*transition*/ ctx[10];
    			if (dirty & /*onClick*/ 2048) mark_changes.onClick = /*onClick*/ ctx[11];
    			if (dirty & /*onMousedown*/ 4096) mark_changes.onMousedown = /*onMousedown*/ ctx[12];
    			if (dirty & /*onMouseup*/ 8192) mark_changes.onMouseup = /*onMouseup*/ ctx[13];
    			if (dirty & /*onMouseover*/ 16384) mark_changes.onMouseover = /*onMouseover*/ ctx[14];
    			if (dirty & /*onMouseout*/ 32768) mark_changes.onMouseout = /*onMouseout*/ ctx[15];
    			if (dirty & /*onMousedrag*/ 65536) mark_changes.onMousedrag = /*onMousedrag*/ ctx[16];
    			if (dirty & /*onTouchdown*/ 131072) mark_changes.onTouchdown = /*onTouchdown*/ ctx[17];
    			if (dirty & /*onTouchup*/ 262144) mark_changes.onTouchup = /*onTouchup*/ ctx[18];
    			if (dirty & /*onTouchover*/ 524288) mark_changes.onTouchover = /*onTouchover*/ ctx[19];
    			if (dirty & /*onTouchout*/ 1048576) mark_changes.onTouchout = /*onTouchout*/ ctx[20];
    			if (dirty & /*onTouchdrag*/ 2097152) mark_changes.onTouchdrag = /*onTouchdrag*/ ctx[21];
    			if (dirty & /*onSelect*/ 4194304) mark_changes.onSelect = /*onSelect*/ ctx[22];
    			if (dirty & /*onDeselect*/ 8388608) mark_changes.onDeselect = /*onDeselect*/ ctx[23];
    			if (dirty & /*renderSettings*/ 16777216) mark_changes.renderSettings = /*renderSettings*/ ctx[24];
    			if (dirty & /*blockReindexing*/ 33554432) mark_changes.blockReindexing = /*blockReindexing*/ ctx[25];
    			if (dirty & /*clip*/ 67108864) mark_changes.clip = /*clip*/ ctx[26];
    			mark.$set(mark_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mark.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mark.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mark, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Point", slots, []);
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { geometry = undefined } = $$props;
    	let { radius = undefined } = $$props;
    	let { fill = undefined } = $$props;
    	let { stroke = undefined } = $$props;
    	let { strokeWidth = undefined } = $$props;
    	let { strokeOpacity = undefined } = $$props;
    	let { fillOpacity = undefined } = $$props;
    	let { opacity = undefined } = $$props;
    	let { transition = undefined } = $$props;
    	let { onClick = undefined } = $$props;
    	let { onMousedown = undefined } = $$props;
    	let { onMouseup = undefined } = $$props;
    	let { onMouseover = undefined } = $$props;
    	let { onMouseout = undefined } = $$props;
    	let { onMousedrag = undefined } = $$props;
    	let { onTouchdown = undefined } = $$props;
    	let { onTouchup = undefined } = $$props;
    	let { onTouchover = undefined } = $$props;
    	let { onTouchout = undefined } = $$props;
    	let { onTouchdrag = undefined } = $$props;
    	let { onSelect = undefined } = $$props;
    	let { onDeselect = undefined } = $$props;
    	let { renderSettings = undefined } = $$props;
    	let { blockReindexing = false } = $$props;
    	let { clip = true } = $$props;

    	const writable_props = [
    		"x",
    		"y",
    		"geometry",
    		"radius",
    		"fill",
    		"stroke",
    		"strokeWidth",
    		"strokeOpacity",
    		"fillOpacity",
    		"opacity",
    		"transition",
    		"onClick",
    		"onMousedown",
    		"onMouseup",
    		"onMouseover",
    		"onMouseout",
    		"onMousedrag",
    		"onTouchdown",
    		"onTouchup",
    		"onTouchover",
    		"onTouchout",
    		"onTouchdrag",
    		"onSelect",
    		"onDeselect",
    		"renderSettings",
    		"blockReindexing",
    		"clip"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Point> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("geometry" in $$props) $$invalidate(2, geometry = $$props.geometry);
    		if ("radius" in $$props) $$invalidate(3, radius = $$props.radius);
    		if ("fill" in $$props) $$invalidate(4, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(5, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(6, strokeWidth = $$props.strokeWidth);
    		if ("strokeOpacity" in $$props) $$invalidate(7, strokeOpacity = $$props.strokeOpacity);
    		if ("fillOpacity" in $$props) $$invalidate(8, fillOpacity = $$props.fillOpacity);
    		if ("opacity" in $$props) $$invalidate(9, opacity = $$props.opacity);
    		if ("transition" in $$props) $$invalidate(10, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(11, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(12, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(13, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(14, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(15, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(16, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(17, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(18, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(19, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(20, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(21, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(22, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(23, onDeselect = $$props.onDeselect);
    		if ("renderSettings" in $$props) $$invalidate(24, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(25, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(26, clip = $$props.clip);
    	};

    	$$self.$capture_state = () => ({
    		Mark,
    		x,
    		y,
    		geometry,
    		radius,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		renderSettings,
    		blockReindexing,
    		clip
    	});

    	$$self.$inject_state = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("geometry" in $$props) $$invalidate(2, geometry = $$props.geometry);
    		if ("radius" in $$props) $$invalidate(3, radius = $$props.radius);
    		if ("fill" in $$props) $$invalidate(4, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(5, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(6, strokeWidth = $$props.strokeWidth);
    		if ("strokeOpacity" in $$props) $$invalidate(7, strokeOpacity = $$props.strokeOpacity);
    		if ("fillOpacity" in $$props) $$invalidate(8, fillOpacity = $$props.fillOpacity);
    		if ("opacity" in $$props) $$invalidate(9, opacity = $$props.opacity);
    		if ("transition" in $$props) $$invalidate(10, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(11, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(12, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(13, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(14, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(15, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(16, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(17, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(18, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(19, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(20, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(21, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(22, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(23, onDeselect = $$props.onDeselect);
    		if ("renderSettings" in $$props) $$invalidate(24, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(25, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(26, clip = $$props.clip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		x,
    		y,
    		geometry,
    		radius,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		renderSettings,
    		blockReindexing,
    		clip
    	];
    }

    class Point extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			x: 0,
    			y: 1,
    			geometry: 2,
    			radius: 3,
    			fill: 4,
    			stroke: 5,
    			strokeWidth: 6,
    			strokeOpacity: 7,
    			fillOpacity: 8,
    			opacity: 9,
    			transition: 10,
    			onClick: 11,
    			onMousedown: 12,
    			onMouseup: 13,
    			onMouseover: 14,
    			onMouseout: 15,
    			onMousedrag: 16,
    			onTouchdown: 17,
    			onTouchup: 18,
    			onTouchover: 19,
    			onTouchout: 20,
    			onTouchdrag: 21,
    			onSelect: 22,
    			onDeselect: 23,
    			renderSettings: 24,
    			blockReindexing: 25,
    			clip: 26
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Point",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get x() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get geometry() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set geometry(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radius() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radius(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeOpacity() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeOpacity(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fillOpacity() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fillOpacity(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedown() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedown(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseup() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseup(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseover() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseover(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseout() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseout(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedrag() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedrag(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdown() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdown(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchup() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchup(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchover() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchover(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchout() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchout(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdrag() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdrag(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSelect() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSelect(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDeselect() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDeselect(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderSettings() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderSettings(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blockReindexing() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blockReindexing(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clip() {
    		throw new Error("<Point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clip(value) {
    		throw new Error("<Point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@snlab/florence/src/components/Marks/Line/Line.svelte generated by Svelte v3.37.0 */

    function create_fragment$9(ctx) {
    	let mark;
    	let current;

    	mark = new Mark({
    			props: {
    				type: "Line",
    				x: /*x*/ ctx[0],
    				y: /*y*/ ctx[1],
    				geometry: /*geometry*/ ctx[2],
    				strokeWidth: /*strokeWidth*/ ctx[3],
    				stroke: /*stroke*/ ctx[4],
    				opacity: /*opacity*/ ctx[5],
    				transition: /*transition*/ ctx[6],
    				onClick: /*onClick*/ ctx[7],
    				onMousedown: /*onMousedown*/ ctx[8],
    				onMouseup: /*onMouseup*/ ctx[9],
    				onMouseover: /*onMouseover*/ ctx[10],
    				onMouseout: /*onMouseout*/ ctx[11],
    				onMousedrag: /*onMousedrag*/ ctx[12],
    				onTouchdown: /*onTouchdown*/ ctx[13],
    				onTouchup: /*onTouchup*/ ctx[14],
    				onTouchover: /*onTouchover*/ ctx[15],
    				onTouchout: /*onTouchout*/ ctx[16],
    				onTouchdrag: /*onTouchdrag*/ ctx[17],
    				onSelect: /*onSelect*/ ctx[18],
    				onDeselect: /*onDeselect*/ ctx[19],
    				renderSettings: /*renderSettings*/ ctx[20],
    				blockReindexing: /*blockReindexing*/ ctx[21],
    				clip: /*clip*/ ctx[22],
    				_asPolygon: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mark.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(mark, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const mark_changes = {};
    			if (dirty & /*x*/ 1) mark_changes.x = /*x*/ ctx[0];
    			if (dirty & /*y*/ 2) mark_changes.y = /*y*/ ctx[1];
    			if (dirty & /*geometry*/ 4) mark_changes.geometry = /*geometry*/ ctx[2];
    			if (dirty & /*strokeWidth*/ 8) mark_changes.strokeWidth = /*strokeWidth*/ ctx[3];
    			if (dirty & /*stroke*/ 16) mark_changes.stroke = /*stroke*/ ctx[4];
    			if (dirty & /*opacity*/ 32) mark_changes.opacity = /*opacity*/ ctx[5];
    			if (dirty & /*transition*/ 64) mark_changes.transition = /*transition*/ ctx[6];
    			if (dirty & /*onClick*/ 128) mark_changes.onClick = /*onClick*/ ctx[7];
    			if (dirty & /*onMousedown*/ 256) mark_changes.onMousedown = /*onMousedown*/ ctx[8];
    			if (dirty & /*onMouseup*/ 512) mark_changes.onMouseup = /*onMouseup*/ ctx[9];
    			if (dirty & /*onMouseover*/ 1024) mark_changes.onMouseover = /*onMouseover*/ ctx[10];
    			if (dirty & /*onMouseout*/ 2048) mark_changes.onMouseout = /*onMouseout*/ ctx[11];
    			if (dirty & /*onMousedrag*/ 4096) mark_changes.onMousedrag = /*onMousedrag*/ ctx[12];
    			if (dirty & /*onTouchdown*/ 8192) mark_changes.onTouchdown = /*onTouchdown*/ ctx[13];
    			if (dirty & /*onTouchup*/ 16384) mark_changes.onTouchup = /*onTouchup*/ ctx[14];
    			if (dirty & /*onTouchover*/ 32768) mark_changes.onTouchover = /*onTouchover*/ ctx[15];
    			if (dirty & /*onTouchout*/ 65536) mark_changes.onTouchout = /*onTouchout*/ ctx[16];
    			if (dirty & /*onTouchdrag*/ 131072) mark_changes.onTouchdrag = /*onTouchdrag*/ ctx[17];
    			if (dirty & /*onSelect*/ 262144) mark_changes.onSelect = /*onSelect*/ ctx[18];
    			if (dirty & /*onDeselect*/ 524288) mark_changes.onDeselect = /*onDeselect*/ ctx[19];
    			if (dirty & /*renderSettings*/ 1048576) mark_changes.renderSettings = /*renderSettings*/ ctx[20];
    			if (dirty & /*blockReindexing*/ 2097152) mark_changes.blockReindexing = /*blockReindexing*/ ctx[21];
    			if (dirty & /*clip*/ 4194304) mark_changes.clip = /*clip*/ ctx[22];
    			mark.$set(mark_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mark.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mark.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mark, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Line", slots, []);
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { geometry = undefined } = $$props;
    	let { strokeWidth = undefined } = $$props;
    	let { stroke = undefined } = $$props;
    	let { opacity = undefined } = $$props;
    	let { transition = undefined } = $$props;
    	let { onClick = undefined } = $$props;
    	let { onMousedown = undefined } = $$props;
    	let { onMouseup = undefined } = $$props;
    	let { onMouseover = undefined } = $$props;
    	let { onMouseout = undefined } = $$props;
    	let { onMousedrag = undefined } = $$props;
    	let { onTouchdown = undefined } = $$props;
    	let { onTouchup = undefined } = $$props;
    	let { onTouchover = undefined } = $$props;
    	let { onTouchout = undefined } = $$props;
    	let { onTouchdrag = undefined } = $$props;
    	let { onSelect = undefined } = $$props;
    	let { onDeselect = undefined } = $$props;
    	let { renderSettings = undefined } = $$props;
    	let { blockReindexing = false } = $$props;
    	let { clip = true } = $$props;

    	const writable_props = [
    		"x",
    		"y",
    		"geometry",
    		"strokeWidth",
    		"stroke",
    		"opacity",
    		"transition",
    		"onClick",
    		"onMousedown",
    		"onMouseup",
    		"onMouseover",
    		"onMouseout",
    		"onMousedrag",
    		"onTouchdown",
    		"onTouchup",
    		"onTouchover",
    		"onTouchout",
    		"onTouchdrag",
    		"onSelect",
    		"onDeselect",
    		"renderSettings",
    		"blockReindexing",
    		"clip"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Line> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("geometry" in $$props) $$invalidate(2, geometry = $$props.geometry);
    		if ("strokeWidth" in $$props) $$invalidate(3, strokeWidth = $$props.strokeWidth);
    		if ("stroke" in $$props) $$invalidate(4, stroke = $$props.stroke);
    		if ("opacity" in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ("transition" in $$props) $$invalidate(6, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(7, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(8, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(9, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(10, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(11, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(12, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(13, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(14, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(15, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(16, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(17, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(18, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(19, onDeselect = $$props.onDeselect);
    		if ("renderSettings" in $$props) $$invalidate(20, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(21, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(22, clip = $$props.clip);
    	};

    	$$self.$capture_state = () => ({
    		Mark,
    		x,
    		y,
    		geometry,
    		strokeWidth,
    		stroke,
    		opacity,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		renderSettings,
    		blockReindexing,
    		clip
    	});

    	$$self.$inject_state = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("geometry" in $$props) $$invalidate(2, geometry = $$props.geometry);
    		if ("strokeWidth" in $$props) $$invalidate(3, strokeWidth = $$props.strokeWidth);
    		if ("stroke" in $$props) $$invalidate(4, stroke = $$props.stroke);
    		if ("opacity" in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ("transition" in $$props) $$invalidate(6, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(7, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(8, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(9, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(10, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(11, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(12, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(13, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(14, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(15, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(16, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(17, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(18, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(19, onDeselect = $$props.onDeselect);
    		if ("renderSettings" in $$props) $$invalidate(20, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(21, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(22, clip = $$props.clip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		x,
    		y,
    		geometry,
    		strokeWidth,
    		stroke,
    		opacity,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		renderSettings,
    		blockReindexing,
    		clip
    	];
    }

    class Line extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			x: 0,
    			y: 1,
    			geometry: 2,
    			strokeWidth: 3,
    			stroke: 4,
    			opacity: 5,
    			transition: 6,
    			onClick: 7,
    			onMousedown: 8,
    			onMouseup: 9,
    			onMouseover: 10,
    			onMouseout: 11,
    			onMousedrag: 12,
    			onTouchdown: 13,
    			onTouchup: 14,
    			onTouchover: 15,
    			onTouchout: 16,
    			onTouchdrag: 17,
    			onSelect: 18,
    			onDeselect: 19,
    			renderSettings: 20,
    			blockReindexing: 21,
    			clip: 22
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Line",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get x() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get geometry() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set geometry(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedown() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedown(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseup() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseup(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseover() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseover(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseout() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseout(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedrag() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedrag(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdown() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdown(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchup() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchup(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchover() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchover(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchout() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchout(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdrag() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdrag(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSelect() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSelect(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDeselect() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDeselect(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderSettings() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderSettings(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blockReindexing() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blockReindexing(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clip() {
    		throw new Error("<Line>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clip(value) {
    		throw new Error("<Line>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@snlab/florence/src/components/Marks/Label/Label.svelte generated by Svelte v3.37.0 */

    function create_fragment$8(ctx) {
    	let mark;
    	let current;

    	mark = new Mark({
    			props: {
    				type: "Label",
    				x: /*x*/ ctx[0],
    				y: /*y*/ ctx[1],
    				geometry: /*geometry*/ ctx[2],
    				fill: /*fill*/ ctx[3],
    				stroke: /*stroke*/ ctx[4],
    				strokeWidth: /*strokeWidth*/ ctx[5],
    				strokeOpacity: /*strokeOpacity*/ ctx[6],
    				fillOpacity: /*fillOpacity*/ ctx[7],
    				opacity: /*opacity*/ ctx[8],
    				text: /*text*/ ctx[9],
    				fontFamily: /*fontFamily*/ ctx[10],
    				fontSize: /*fontSize*/ ctx[11],
    				fontWeight: /*fontWeight*/ ctx[12],
    				rotation: /*rotation*/ ctx[13],
    				anchorPoint: /*anchorPoint*/ ctx[14],
    				transition: /*transition*/ ctx[15],
    				onClick: /*onClick*/ ctx[16],
    				onMousedown: /*onMousedown*/ ctx[17],
    				onMouseup: /*onMouseup*/ ctx[18],
    				onMouseover: /*onMouseover*/ ctx[19],
    				onMouseout: /*onMouseout*/ ctx[20],
    				onMousedrag: /*onMousedrag*/ ctx[21],
    				onTouchdown: /*onTouchdown*/ ctx[22],
    				onTouchup: /*onTouchup*/ ctx[23],
    				onTouchover: /*onTouchover*/ ctx[24],
    				onTouchout: /*onTouchout*/ ctx[25],
    				onTouchdrag: /*onTouchdrag*/ ctx[26],
    				onSelect: /*onSelect*/ ctx[27],
    				onDeselect: /*onDeselect*/ ctx[28],
    				renderSettings: /*renderSettings*/ ctx[29],
    				blockReindexing: /*blockReindexing*/ ctx[30],
    				clip: /*clip*/ ctx[31],
    				_asPolygon: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(mark.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(mark, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const mark_changes = {};
    			if (dirty[0] & /*x*/ 1) mark_changes.x = /*x*/ ctx[0];
    			if (dirty[0] & /*y*/ 2) mark_changes.y = /*y*/ ctx[1];
    			if (dirty[0] & /*geometry*/ 4) mark_changes.geometry = /*geometry*/ ctx[2];
    			if (dirty[0] & /*fill*/ 8) mark_changes.fill = /*fill*/ ctx[3];
    			if (dirty[0] & /*stroke*/ 16) mark_changes.stroke = /*stroke*/ ctx[4];
    			if (dirty[0] & /*strokeWidth*/ 32) mark_changes.strokeWidth = /*strokeWidth*/ ctx[5];
    			if (dirty[0] & /*strokeOpacity*/ 64) mark_changes.strokeOpacity = /*strokeOpacity*/ ctx[6];
    			if (dirty[0] & /*fillOpacity*/ 128) mark_changes.fillOpacity = /*fillOpacity*/ ctx[7];
    			if (dirty[0] & /*opacity*/ 256) mark_changes.opacity = /*opacity*/ ctx[8];
    			if (dirty[0] & /*text*/ 512) mark_changes.text = /*text*/ ctx[9];
    			if (dirty[0] & /*fontFamily*/ 1024) mark_changes.fontFamily = /*fontFamily*/ ctx[10];
    			if (dirty[0] & /*fontSize*/ 2048) mark_changes.fontSize = /*fontSize*/ ctx[11];
    			if (dirty[0] & /*fontWeight*/ 4096) mark_changes.fontWeight = /*fontWeight*/ ctx[12];
    			if (dirty[0] & /*rotation*/ 8192) mark_changes.rotation = /*rotation*/ ctx[13];
    			if (dirty[0] & /*anchorPoint*/ 16384) mark_changes.anchorPoint = /*anchorPoint*/ ctx[14];
    			if (dirty[0] & /*transition*/ 32768) mark_changes.transition = /*transition*/ ctx[15];
    			if (dirty[0] & /*onClick*/ 65536) mark_changes.onClick = /*onClick*/ ctx[16];
    			if (dirty[0] & /*onMousedown*/ 131072) mark_changes.onMousedown = /*onMousedown*/ ctx[17];
    			if (dirty[0] & /*onMouseup*/ 262144) mark_changes.onMouseup = /*onMouseup*/ ctx[18];
    			if (dirty[0] & /*onMouseover*/ 524288) mark_changes.onMouseover = /*onMouseover*/ ctx[19];
    			if (dirty[0] & /*onMouseout*/ 1048576) mark_changes.onMouseout = /*onMouseout*/ ctx[20];
    			if (dirty[0] & /*onMousedrag*/ 2097152) mark_changes.onMousedrag = /*onMousedrag*/ ctx[21];
    			if (dirty[0] & /*onTouchdown*/ 4194304) mark_changes.onTouchdown = /*onTouchdown*/ ctx[22];
    			if (dirty[0] & /*onTouchup*/ 8388608) mark_changes.onTouchup = /*onTouchup*/ ctx[23];
    			if (dirty[0] & /*onTouchover*/ 16777216) mark_changes.onTouchover = /*onTouchover*/ ctx[24];
    			if (dirty[0] & /*onTouchout*/ 33554432) mark_changes.onTouchout = /*onTouchout*/ ctx[25];
    			if (dirty[0] & /*onTouchdrag*/ 67108864) mark_changes.onTouchdrag = /*onTouchdrag*/ ctx[26];
    			if (dirty[0] & /*onSelect*/ 134217728) mark_changes.onSelect = /*onSelect*/ ctx[27];
    			if (dirty[0] & /*onDeselect*/ 268435456) mark_changes.onDeselect = /*onDeselect*/ ctx[28];
    			if (dirty[0] & /*renderSettings*/ 536870912) mark_changes.renderSettings = /*renderSettings*/ ctx[29];
    			if (dirty[0] & /*blockReindexing*/ 1073741824) mark_changes.blockReindexing = /*blockReindexing*/ ctx[30];
    			if (dirty[1] & /*clip*/ 1) mark_changes.clip = /*clip*/ ctx[31];
    			mark.$set(mark_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mark.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mark.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mark, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Label", slots, []);
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { geometry = undefined } = $$props;
    	let { fill = undefined } = $$props;
    	let { stroke = undefined } = $$props;
    	let { strokeWidth = undefined } = $$props;
    	let { strokeOpacity = undefined } = $$props;
    	let { fillOpacity = undefined } = $$props;
    	let { opacity = undefined } = $$props;
    	let { text = undefined } = $$props;
    	let { fontFamily = undefined } = $$props;
    	let { fontSize = undefined } = $$props;
    	let { fontWeight = undefined } = $$props;
    	let { rotation = undefined } = $$props;
    	let { anchorPoint = undefined } = $$props;
    	let { transition = undefined } = $$props;
    	let { onClick = undefined } = $$props;
    	let { onMousedown = undefined } = $$props;
    	let { onMouseup = undefined } = $$props;
    	let { onMouseover = undefined } = $$props;
    	let { onMouseout = undefined } = $$props;
    	let { onMousedrag = undefined } = $$props;
    	let { onTouchdown = undefined } = $$props;
    	let { onTouchup = undefined } = $$props;
    	let { onTouchover = undefined } = $$props;
    	let { onTouchout = undefined } = $$props;
    	let { onTouchdrag = undefined } = $$props;
    	let { onSelect = undefined } = $$props;
    	let { onDeselect = undefined } = $$props;
    	let { renderSettings = undefined } = $$props;
    	let { blockReindexing = false } = $$props;
    	let { clip = true } = $$props;

    	const writable_props = [
    		"x",
    		"y",
    		"geometry",
    		"fill",
    		"stroke",
    		"strokeWidth",
    		"strokeOpacity",
    		"fillOpacity",
    		"opacity",
    		"text",
    		"fontFamily",
    		"fontSize",
    		"fontWeight",
    		"rotation",
    		"anchorPoint",
    		"transition",
    		"onClick",
    		"onMousedown",
    		"onMouseup",
    		"onMouseover",
    		"onMouseout",
    		"onMousedrag",
    		"onTouchdown",
    		"onTouchup",
    		"onTouchover",
    		"onTouchout",
    		"onTouchdrag",
    		"onSelect",
    		"onDeselect",
    		"renderSettings",
    		"blockReindexing",
    		"clip"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Label> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("geometry" in $$props) $$invalidate(2, geometry = $$props.geometry);
    		if ("fill" in $$props) $$invalidate(3, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(4, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(5, strokeWidth = $$props.strokeWidth);
    		if ("strokeOpacity" in $$props) $$invalidate(6, strokeOpacity = $$props.strokeOpacity);
    		if ("fillOpacity" in $$props) $$invalidate(7, fillOpacity = $$props.fillOpacity);
    		if ("opacity" in $$props) $$invalidate(8, opacity = $$props.opacity);
    		if ("text" in $$props) $$invalidate(9, text = $$props.text);
    		if ("fontFamily" in $$props) $$invalidate(10, fontFamily = $$props.fontFamily);
    		if ("fontSize" in $$props) $$invalidate(11, fontSize = $$props.fontSize);
    		if ("fontWeight" in $$props) $$invalidate(12, fontWeight = $$props.fontWeight);
    		if ("rotation" in $$props) $$invalidate(13, rotation = $$props.rotation);
    		if ("anchorPoint" in $$props) $$invalidate(14, anchorPoint = $$props.anchorPoint);
    		if ("transition" in $$props) $$invalidate(15, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(16, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(17, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(18, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(19, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(20, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(21, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(22, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(23, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(24, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(25, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(26, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(27, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(28, onDeselect = $$props.onDeselect);
    		if ("renderSettings" in $$props) $$invalidate(29, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(30, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(31, clip = $$props.clip);
    	};

    	$$self.$capture_state = () => ({
    		Mark,
    		x,
    		y,
    		geometry,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		text,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		rotation,
    		anchorPoint,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		renderSettings,
    		blockReindexing,
    		clip
    	});

    	$$self.$inject_state = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("geometry" in $$props) $$invalidate(2, geometry = $$props.geometry);
    		if ("fill" in $$props) $$invalidate(3, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(4, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(5, strokeWidth = $$props.strokeWidth);
    		if ("strokeOpacity" in $$props) $$invalidate(6, strokeOpacity = $$props.strokeOpacity);
    		if ("fillOpacity" in $$props) $$invalidate(7, fillOpacity = $$props.fillOpacity);
    		if ("opacity" in $$props) $$invalidate(8, opacity = $$props.opacity);
    		if ("text" in $$props) $$invalidate(9, text = $$props.text);
    		if ("fontFamily" in $$props) $$invalidate(10, fontFamily = $$props.fontFamily);
    		if ("fontSize" in $$props) $$invalidate(11, fontSize = $$props.fontSize);
    		if ("fontWeight" in $$props) $$invalidate(12, fontWeight = $$props.fontWeight);
    		if ("rotation" in $$props) $$invalidate(13, rotation = $$props.rotation);
    		if ("anchorPoint" in $$props) $$invalidate(14, anchorPoint = $$props.anchorPoint);
    		if ("transition" in $$props) $$invalidate(15, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(16, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(17, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(18, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(19, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(20, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(21, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(22, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(23, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(24, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(25, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(26, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(27, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(28, onDeselect = $$props.onDeselect);
    		if ("renderSettings" in $$props) $$invalidate(29, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(30, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(31, clip = $$props.clip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		x,
    		y,
    		geometry,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		text,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		rotation,
    		anchorPoint,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		renderSettings,
    		blockReindexing,
    		clip
    	];
    }

    class Label extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(
    			this,
    			options,
    			instance$8,
    			create_fragment$8,
    			safe_not_equal,
    			{
    				x: 0,
    				y: 1,
    				geometry: 2,
    				fill: 3,
    				stroke: 4,
    				strokeWidth: 5,
    				strokeOpacity: 6,
    				fillOpacity: 7,
    				opacity: 8,
    				text: 9,
    				fontFamily: 10,
    				fontSize: 11,
    				fontWeight: 12,
    				rotation: 13,
    				anchorPoint: 14,
    				transition: 15,
    				onClick: 16,
    				onMousedown: 17,
    				onMouseup: 18,
    				onMouseover: 19,
    				onMouseout: 20,
    				onMousedrag: 21,
    				onTouchdown: 22,
    				onTouchup: 23,
    				onTouchover: 24,
    				onTouchout: 25,
    				onTouchdrag: 26,
    				onSelect: 27,
    				onDeselect: 28,
    				renderSettings: 29,
    				blockReindexing: 30,
    				clip: 31
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Label",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get x() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get geometry() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set geometry(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeOpacity() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeOpacity(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fillOpacity() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fillOpacity(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontFamily() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontFamily(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontSize() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontSize(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontWeight() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontWeight(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotation() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotation(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchorPoint() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchorPoint(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedown() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedown(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseup() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseup(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseover() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseover(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseout() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseout(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedrag() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedrag(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdown() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdown(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchup() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchup(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchover() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchover(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchout() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchout(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdrag() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdrag(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSelect() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSelect(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDeselect() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDeselect(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderSettings() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderSettings(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blockReindexing() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blockReindexing(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clip() {
    		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clip(value) {
    		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * This function is only used when dealing with layers.
     * For layers, most 'aesthetic' props can be specified in two ways:
     *  - An Array of values is passed to the prop
     *  - A single value is passed to the prop
     * In both cases, we need to convert whatever was passed to an Object.
     * The keys will be whatever the user used as 'key' Array, and the values
     * are whatever the user used passed to the prop in question.
     * If the user passed an Array, the values of the Object correspond to the values in the Array.
     * If the user passed a single value, every value in the Object will be that value.
     * The object structure is necessary to do transitions later.
     *
     * @param {*} propValue Whatever was passed to the prop
     * @param {*} keyArray The array of indices to be used as keys
     * @returns {Object.<Number, *>} The 'prop Object'
     */
    function generatePropObject (propValue, keyArray) {
      const propObj = {};

      if (isDefined(propValue)) {
        if (propValue.constructor === Array) {
          for (let i = 0; i < keyArray.length; i++) {
            const key = keyArray[i];
            propObj[key] = propValue[i];
          }
        } else if (propValue.constructor === Function) {
          for (let index = 0; index < keyArray.length; index++) {
            const key = keyArray[index];
            propObj[key] = propValue({ key, index });
          }
        } else {
          for (let i = 0; i < keyArray.length; i++) {
            const key = keyArray[i];
            propObj[key] = propValue;
          }
        }
      }

      return propObj
    }

    /* node_modules/@snlab/florence/src/components/Marks/Mark/Layer.svelte generated by Svelte v3.37.0 */

    const { Object: Object_1$1 } = globals;
    const file$5 = "node_modules/@snlab/florence/src/components/Marks/Mark/Layer.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[115] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[115] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[115] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[115] = list[i];
    	return child_ctx;
    }

    // (446:0) {#if $graphicContext.output() === 'svg'}
    function create_if_block_1$2(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let if_block0 = /*renderPolygon*/ ctx[28] && create_if_block_4(ctx);
    	let if_block1 = /*renderCircle*/ ctx[29] && create_if_block_3(ctx);
    	let if_block2 = /*renderLine*/ ctx[30] && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*renderPolygon*/ ctx[28]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*renderCircle*/ ctx[29]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*renderLine*/ ctx[30]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$2(ctx);
    					if_block2.c();
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(446:0) {#if $graphicContext.output() === 'svg'}",
    		ctx
    	});

    	return block;
    }

    // (448:2) {#if renderPolygon}
    function create_if_block_4(ctx) {
    	let g;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let g_clip_path_value;
    	let g_class_value;
    	let each_value_3 = Object.keys(/*$tr_screenGeometryObject*/ ctx[17]);
    	validate_each_argument(each_value_3);
    	const get_key = ctx => /*$key*/ ctx[115];
    	validate_each_keys(ctx, each_value_3, get_each_context_3, get_key);

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3(ctx, each_value_3, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "clip-path", g_clip_path_value = /*clip*/ ctx[1]
    			? `url(#clip-${/*$sectionContext*/ ctx[12].sectionId})`
    			: "none");

    			attr_dev(g, "class", g_class_value = `${/*type*/ ctx[0].toLowerCase()}-layer`);
    			add_location(g, file$5, 449, 4, 15808);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*type, $tr_screenGeometryObject, $tr_fillObject, $tr_strokeObject, $tr_strokeWidthObject, $tr_fillOpacityObject, $tr_strokeOpacityObject, $tr_opacityObject*/ 33161217) {
    				each_value_3 = Object.keys(/*$tr_screenGeometryObject*/ ctx[17]);
    				validate_each_argument(each_value_3);
    				validate_each_keys(ctx, each_value_3, get_each_context_3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_3, each_1_lookup, g, destroy_block, create_each_block_3, null, get_each_context_3);
    			}

    			if (dirty[0] & /*clip, $sectionContext*/ 4098 && g_clip_path_value !== (g_clip_path_value = /*clip*/ ctx[1]
    			? `url(#clip-${/*$sectionContext*/ ctx[12].sectionId})`
    			: "none")) {
    				attr_dev(g, "clip-path", g_clip_path_value);
    			}

    			if (dirty[0] & /*type*/ 1 && g_class_value !== (g_class_value = `${/*type*/ ctx[0].toLowerCase()}-layer`)) {
    				attr_dev(g, "class", g_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(448:2) {#if renderPolygon}",
    		ctx
    	});

    	return block;
    }

    // (455:6) {#each Object.keys($tr_screenGeometryObject) as $key ($key)}
    function create_each_block_3(key_2, ctx) {
    	let path;
    	let path_class_value;
    	let path_d_value;
    	let path_fill_value;
    	let path_stroke_value;
    	let path_stroke_width_value;
    	let path_fill_opacity_value;
    	let path_stroke_opacity_value;
    	let path_opacity_value;

    	const block = {
    		key: key_2,
    		first: null,
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "class", path_class_value = /*type*/ ctx[0].toLowerCase());
    			attr_dev(path, "d", path_d_value = generatePath(/*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]]));
    			attr_dev(path, "fill", path_fill_value = /*$tr_fillObject*/ ctx[19][/*$key*/ ctx[115]]);
    			attr_dev(path, "stroke", path_stroke_value = /*$tr_strokeObject*/ ctx[20][/*$key*/ ctx[115]]);
    			attr_dev(path, "stroke-width", path_stroke_width_value = /*$tr_strokeWidthObject*/ ctx[21][/*$key*/ ctx[115]]);
    			attr_dev(path, "fill-opacity", path_fill_opacity_value = /*$tr_fillOpacityObject*/ ctx[23][/*$key*/ ctx[115]]);
    			attr_dev(path, "stroke-opacity", path_stroke_opacity_value = /*$tr_strokeOpacityObject*/ ctx[22][/*$key*/ ctx[115]]);
    			attr_dev(path, "opacity", path_opacity_value = /*$tr_opacityObject*/ ctx[24][/*$key*/ ctx[115]]);
    			add_location(path, file$5, 456, 8, 16015);
    			this.first = path;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*type*/ 1 && path_class_value !== (path_class_value = /*type*/ ctx[0].toLowerCase())) {
    				attr_dev(path, "class", path_class_value);
    			}

    			if (dirty[0] & /*$tr_screenGeometryObject*/ 131072 && path_d_value !== (path_d_value = generatePath(/*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]]))) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty[0] & /*$tr_fillObject, $tr_screenGeometryObject*/ 655360 && path_fill_value !== (path_fill_value = /*$tr_fillObject*/ ctx[19][/*$key*/ ctx[115]])) {
    				attr_dev(path, "fill", path_fill_value);
    			}

    			if (dirty[0] & /*$tr_strokeObject, $tr_screenGeometryObject*/ 1179648 && path_stroke_value !== (path_stroke_value = /*$tr_strokeObject*/ ctx[20][/*$key*/ ctx[115]])) {
    				attr_dev(path, "stroke", path_stroke_value);
    			}

    			if (dirty[0] & /*$tr_strokeWidthObject, $tr_screenGeometryObject*/ 2228224 && path_stroke_width_value !== (path_stroke_width_value = /*$tr_strokeWidthObject*/ ctx[21][/*$key*/ ctx[115]])) {
    				attr_dev(path, "stroke-width", path_stroke_width_value);
    			}

    			if (dirty[0] & /*$tr_fillOpacityObject, $tr_screenGeometryObject*/ 8519680 && path_fill_opacity_value !== (path_fill_opacity_value = /*$tr_fillOpacityObject*/ ctx[23][/*$key*/ ctx[115]])) {
    				attr_dev(path, "fill-opacity", path_fill_opacity_value);
    			}

    			if (dirty[0] & /*$tr_strokeOpacityObject, $tr_screenGeometryObject*/ 4325376 && path_stroke_opacity_value !== (path_stroke_opacity_value = /*$tr_strokeOpacityObject*/ ctx[22][/*$key*/ ctx[115]])) {
    				attr_dev(path, "stroke-opacity", path_stroke_opacity_value);
    			}

    			if (dirty[0] & /*$tr_opacityObject, $tr_screenGeometryObject*/ 16908288 && path_opacity_value !== (path_opacity_value = /*$tr_opacityObject*/ ctx[24][/*$key*/ ctx[115]])) {
    				attr_dev(path, "opacity", path_opacity_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(455:6) {#each Object.keys($tr_screenGeometryObject) as $key ($key)}",
    		ctx
    	});

    	return block;
    }

    // (474:2) {#if renderCircle}
    function create_if_block_3(ctx) {
    	let g;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let g_clip_path_value;
    	let each_value_2 = Object.keys(/*$tr_screenGeometryObject*/ ctx[17]);
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*$key*/ ctx[115];
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "clip-path", g_clip_path_value = /*clip*/ ctx[1]
    			? `url(#clip-${/*$sectionContext*/ ctx[12].sectionId})`
    			: "none");

    			attr_dev(g, "class", "point-layer");
    			add_location(g, file$5, 475, 4, 16476);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$tr_screenGeometryObject, $tr_radiusObject, $tr_fillObject, $tr_strokeObject, $tr_strokeWidthObject, $tr_fillOpacityObject, $tr_strokeOpacityObject, $tr_opacityObject*/ 33423360) {
    				each_value_2 = Object.keys(/*$tr_screenGeometryObject*/ ctx[17]);
    				validate_each_argument(each_value_2);
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, g, destroy_block, create_each_block_2, null, get_each_context_2);
    			}

    			if (dirty[0] & /*clip, $sectionContext*/ 4098 && g_clip_path_value !== (g_clip_path_value = /*clip*/ ctx[1]
    			? `url(#clip-${/*$sectionContext*/ ctx[12].sectionId})`
    			: "none")) {
    				attr_dev(g, "clip-path", g_clip_path_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(474:2) {#if renderCircle}",
    		ctx
    	});

    	return block;
    }

    // (481:6) {#each Object.keys($tr_screenGeometryObject) as $key ($key)}
    function create_each_block_2(key_2, ctx) {
    	let circle;
    	let circle_cx_value;
    	let circle_cy_value;
    	let circle_r_value;
    	let circle_fill_value;
    	let circle_stroke_value;
    	let circle_stroke_width_value;
    	let circle_fill_opacity_value;
    	let circle_stroke_opacity_value;
    	let circle_opacity_value;

    	const block = {
    		key: key_2,
    		first: null,
    		c: function create() {
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "point");
    			attr_dev(circle, "cx", circle_cx_value = /*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[0]);
    			attr_dev(circle, "cy", circle_cy_value = /*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[1]);
    			attr_dev(circle, "r", circle_r_value = /*$tr_radiusObject*/ ctx[18][/*$key*/ ctx[115]]);
    			attr_dev(circle, "fill", circle_fill_value = /*$tr_fillObject*/ ctx[19][/*$key*/ ctx[115]]);
    			attr_dev(circle, "stroke", circle_stroke_value = /*$tr_strokeObject*/ ctx[20][/*$key*/ ctx[115]]);
    			attr_dev(circle, "stroke-width", circle_stroke_width_value = /*$tr_strokeWidthObject*/ ctx[21][/*$key*/ ctx[115]]);
    			attr_dev(circle, "fill-opacity", circle_fill_opacity_value = /*$tr_fillOpacityObject*/ ctx[23][/*$key*/ ctx[115]]);
    			attr_dev(circle, "stroke-opacity", circle_stroke_opacity_value = /*$tr_strokeOpacityObject*/ ctx[22][/*$key*/ ctx[115]]);
    			attr_dev(circle, "opacity", circle_opacity_value = /*$tr_opacityObject*/ ctx[24][/*$key*/ ctx[115]]);
    			add_location(circle, file$5, 482, 8, 16664);
    			this.first = circle;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, circle, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*$tr_screenGeometryObject*/ 131072 && circle_cx_value !== (circle_cx_value = /*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[0])) {
    				attr_dev(circle, "cx", circle_cx_value);
    			}

    			if (dirty[0] & /*$tr_screenGeometryObject*/ 131072 && circle_cy_value !== (circle_cy_value = /*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[1])) {
    				attr_dev(circle, "cy", circle_cy_value);
    			}

    			if (dirty[0] & /*$tr_radiusObject, $tr_screenGeometryObject*/ 393216 && circle_r_value !== (circle_r_value = /*$tr_radiusObject*/ ctx[18][/*$key*/ ctx[115]])) {
    				attr_dev(circle, "r", circle_r_value);
    			}

    			if (dirty[0] & /*$tr_fillObject, $tr_screenGeometryObject*/ 655360 && circle_fill_value !== (circle_fill_value = /*$tr_fillObject*/ ctx[19][/*$key*/ ctx[115]])) {
    				attr_dev(circle, "fill", circle_fill_value);
    			}

    			if (dirty[0] & /*$tr_strokeObject, $tr_screenGeometryObject*/ 1179648 && circle_stroke_value !== (circle_stroke_value = /*$tr_strokeObject*/ ctx[20][/*$key*/ ctx[115]])) {
    				attr_dev(circle, "stroke", circle_stroke_value);
    			}

    			if (dirty[0] & /*$tr_strokeWidthObject, $tr_screenGeometryObject*/ 2228224 && circle_stroke_width_value !== (circle_stroke_width_value = /*$tr_strokeWidthObject*/ ctx[21][/*$key*/ ctx[115]])) {
    				attr_dev(circle, "stroke-width", circle_stroke_width_value);
    			}

    			if (dirty[0] & /*$tr_fillOpacityObject, $tr_screenGeometryObject*/ 8519680 && circle_fill_opacity_value !== (circle_fill_opacity_value = /*$tr_fillOpacityObject*/ ctx[23][/*$key*/ ctx[115]])) {
    				attr_dev(circle, "fill-opacity", circle_fill_opacity_value);
    			}

    			if (dirty[0] & /*$tr_strokeOpacityObject, $tr_screenGeometryObject*/ 4325376 && circle_stroke_opacity_value !== (circle_stroke_opacity_value = /*$tr_strokeOpacityObject*/ ctx[22][/*$key*/ ctx[115]])) {
    				attr_dev(circle, "stroke-opacity", circle_stroke_opacity_value);
    			}

    			if (dirty[0] & /*$tr_opacityObject, $tr_screenGeometryObject*/ 16908288 && circle_opacity_value !== (circle_opacity_value = /*$tr_opacityObject*/ ctx[24][/*$key*/ ctx[115]])) {
    				attr_dev(circle, "opacity", circle_opacity_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(circle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(481:6) {#each Object.keys($tr_screenGeometryObject) as $key ($key)}",
    		ctx
    	});

    	return block;
    }

    // (502:2) {#if renderLine}
    function create_if_block_2$2(ctx) {
    	let g;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let g_clip_path_value;
    	let each_value_1 = Object.keys(/*$tr_screenGeometryObject*/ ctx[17]);
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*$key*/ ctx[115];
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "clip-path", g_clip_path_value = /*clip*/ ctx[1]
    			? `url(#clip-${/*$sectionContext*/ ctx[12].sectionId})`
    			: "none");

    			attr_dev(g, "class", "line-layer");
    			add_location(g, file$5, 503, 4, 17212);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$tr_screenGeometryObject, $tr_strokeWidthObject, $tr_strokeObject, $tr_opacityObject*/ 20054016) {
    				each_value_1 = Object.keys(/*$tr_screenGeometryObject*/ ctx[17]);
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, g, destroy_block, create_each_block_1$1, null, get_each_context_1$1);
    			}

    			if (dirty[0] & /*clip, $sectionContext*/ 4098 && g_clip_path_value !== (g_clip_path_value = /*clip*/ ctx[1]
    			? `url(#clip-${/*$sectionContext*/ ctx[12].sectionId})`
    			: "none")) {
    				attr_dev(g, "clip-path", g_clip_path_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(502:2) {#if renderLine}",
    		ctx
    	});

    	return block;
    }

    // (509:6) {#each Object.keys($tr_screenGeometryObject) as $key ($key)}
    function create_each_block_1$1(key_2, ctx) {
    	let path;
    	let path_d_value;
    	let path_stroke_width_value;
    	let path_stroke_value;
    	let path_style_value;

    	const block = {
    		key: key_2,
    		first: null,
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "class", "line");
    			attr_dev(path, "d", path_d_value = generatePath(/*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]]));
    			attr_dev(path, "fill", "none");
    			attr_dev(path, "stroke-width", path_stroke_width_value = /*$tr_strokeWidthObject*/ ctx[21][/*$key*/ ctx[115]]);
    			attr_dev(path, "stroke", path_stroke_value = /*$tr_strokeObject*/ ctx[20][/*$key*/ ctx[115]]);
    			attr_dev(path, "style", path_style_value = `opacity: ${/*$tr_opacityObject*/ ctx[24][/*$key*/ ctx[115]]}`);
    			add_location(path, file$5, 510, 8, 17400);
    			this.first = path;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*$tr_screenGeometryObject*/ 131072 && path_d_value !== (path_d_value = generatePath(/*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]]))) {
    				attr_dev(path, "d", path_d_value);
    			}

    			if (dirty[0] & /*$tr_strokeWidthObject, $tr_screenGeometryObject*/ 2228224 && path_stroke_width_value !== (path_stroke_width_value = /*$tr_strokeWidthObject*/ ctx[21][/*$key*/ ctx[115]])) {
    				attr_dev(path, "stroke-width", path_stroke_width_value);
    			}

    			if (dirty[0] & /*$tr_strokeObject, $tr_screenGeometryObject*/ 1179648 && path_stroke_value !== (path_stroke_value = /*$tr_strokeObject*/ ctx[20][/*$key*/ ctx[115]])) {
    				attr_dev(path, "stroke", path_stroke_value);
    			}

    			if (dirty[0] & /*$tr_opacityObject, $tr_screenGeometryObject*/ 16908288 && path_style_value !== (path_style_value = `opacity: ${/*$tr_opacityObject*/ ctx[24][/*$key*/ ctx[115]]}`)) {
    				attr_dev(path, "style", path_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(509:6) {#each Object.keys($tr_screenGeometryObject) as $key ($key)}",
    		ctx
    	});

    	return block;
    }

    // (528:0) {#if renderLabel}
    function create_if_block$2(ctx) {
    	let g;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let g_clip_path_value;
    	let each_value = Object.keys(/*$tr_screenGeometryObject*/ ctx[17]);
    	validate_each_argument(each_value);
    	const get_key = ctx => /*$key*/ ctx[115];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			g = svg_element("g");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(g, "clip-path", g_clip_path_value = /*clip*/ ctx[1]
    			? `url(#clip-${/*$sectionContext*/ ctx[12].sectionId})`
    			: "none");

    			attr_dev(g, "class", "label-layer");
    			add_location(g, file$5, 529, 2, 17735);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(g, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$tr_screenGeometryObject, $tr_fillObject, $tr_strokeObject, $tr_strokeWidthObject, $tr_fillOpacityObject, $tr_strokeOpacityObject, $tr_opacityObject, $tr_rotationObject, fontFamilyObject, $tr_fontSizeObject, $tr_fontWeightObject, anchorPointObject, textObject*/ 268099584) {
    				each_value = Object.keys(/*$tr_screenGeometryObject*/ ctx[17]);
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, g, destroy_block, create_each_block$1, null, get_each_context$1);
    			}

    			if (dirty[0] & /*clip, $sectionContext*/ 4098 && g_clip_path_value !== (g_clip_path_value = /*clip*/ ctx[1]
    			? `url(#clip-${/*$sectionContext*/ ctx[12].sectionId})`
    			: "none")) {
    				attr_dev(g, "clip-path", g_clip_path_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(528:0) {#if renderLabel}",
    		ctx
    	});

    	return block;
    }

    // (535:4) {#each Object.keys($tr_screenGeometryObject) as $key ($key)}
    function create_each_block$1(key_2, ctx) {
    	let text_1;
    	let t_value = /*textObject*/ ctx[13][/*$key*/ ctx[115]] + "";
    	let t;
    	let text_1_x_value;
    	let text_1_y_value;
    	let text_1_fill_value;
    	let text_1_stroke_value;
    	let text_1_stroke_width_value;
    	let text_1_fill_opacity_value;
    	let text_1_stroke_opacity_value;
    	let text_1_opacity_value;
    	let text_1_transform_value;
    	let text_1_font_family_value;
    	let text_1_font_size_value;
    	let text_1_font_weight_value;
    	let text_1_text_anchor_value;
    	let text_1_dominant_baseline_value;

    	const block = {
    		key: key_2,
    		first: null,
    		c: function create() {
    			text_1 = svg_element("text");
    			t = text(t_value);
    			attr_dev(text_1, "class", "label");
    			attr_dev(text_1, "x", text_1_x_value = /*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[0]);
    			attr_dev(text_1, "y", text_1_y_value = /*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[1]);
    			attr_dev(text_1, "fill", text_1_fill_value = /*$tr_fillObject*/ ctx[19][/*$key*/ ctx[115]]);
    			attr_dev(text_1, "stroke", text_1_stroke_value = /*$tr_strokeObject*/ ctx[20][/*$key*/ ctx[115]]);
    			attr_dev(text_1, "stroke-width", text_1_stroke_width_value = /*$tr_strokeWidthObject*/ ctx[21][/*$key*/ ctx[115]]);
    			attr_dev(text_1, "fill-opacity", text_1_fill_opacity_value = /*$tr_fillOpacityObject*/ ctx[23][/*$key*/ ctx[115]]);
    			attr_dev(text_1, "stroke-opacity", text_1_stroke_opacity_value = /*$tr_strokeOpacityObject*/ ctx[22][/*$key*/ ctx[115]]);
    			attr_dev(text_1, "opacity", text_1_opacity_value = /*$tr_opacityObject*/ ctx[24][/*$key*/ ctx[115]]);

    			attr_dev(text_1, "transform", text_1_transform_value = `
          rotate(${/*$tr_rotationObject*/ ctx[27][/*$key*/ ctx[115]]}, 
          ${/*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[0]}, 
          ${/*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[1]})
        `);

    			attr_dev(text_1, "font-family", text_1_font_family_value = /*fontFamilyObject*/ ctx[14][/*$key*/ ctx[115]]);
    			attr_dev(text_1, "font-size", text_1_font_size_value = /*$tr_fontSizeObject*/ ctx[25][/*$key*/ ctx[115]] + "px");
    			attr_dev(text_1, "font-weight", text_1_font_weight_value = /*$tr_fontWeightObject*/ ctx[26][/*$key*/ ctx[115]]);
    			attr_dev(text_1, "text-anchor", text_1_text_anchor_value = textAnchorPoint(/*anchorPointObject*/ ctx[15][/*$key*/ ctx[115]]).textAnchor);
    			attr_dev(text_1, "dominant-baseline", text_1_dominant_baseline_value = textAnchorPoint(/*anchorPointObject*/ ctx[15][/*$key*/ ctx[115]]).dominantBaseline);
    			add_location(text_1, file$5, 536, 6, 17914);
    			this.first = text_1;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, text_1, anchor);
    			append_dev(text_1, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*textObject, $tr_screenGeometryObject*/ 139264 && t_value !== (t_value = /*textObject*/ ctx[13][/*$key*/ ctx[115]] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*$tr_screenGeometryObject*/ 131072 && text_1_x_value !== (text_1_x_value = /*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[0])) {
    				attr_dev(text_1, "x", text_1_x_value);
    			}

    			if (dirty[0] & /*$tr_screenGeometryObject*/ 131072 && text_1_y_value !== (text_1_y_value = /*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[1])) {
    				attr_dev(text_1, "y", text_1_y_value);
    			}

    			if (dirty[0] & /*$tr_fillObject, $tr_screenGeometryObject*/ 655360 && text_1_fill_value !== (text_1_fill_value = /*$tr_fillObject*/ ctx[19][/*$key*/ ctx[115]])) {
    				attr_dev(text_1, "fill", text_1_fill_value);
    			}

    			if (dirty[0] & /*$tr_strokeObject, $tr_screenGeometryObject*/ 1179648 && text_1_stroke_value !== (text_1_stroke_value = /*$tr_strokeObject*/ ctx[20][/*$key*/ ctx[115]])) {
    				attr_dev(text_1, "stroke", text_1_stroke_value);
    			}

    			if (dirty[0] & /*$tr_strokeWidthObject, $tr_screenGeometryObject*/ 2228224 && text_1_stroke_width_value !== (text_1_stroke_width_value = /*$tr_strokeWidthObject*/ ctx[21][/*$key*/ ctx[115]])) {
    				attr_dev(text_1, "stroke-width", text_1_stroke_width_value);
    			}

    			if (dirty[0] & /*$tr_fillOpacityObject, $tr_screenGeometryObject*/ 8519680 && text_1_fill_opacity_value !== (text_1_fill_opacity_value = /*$tr_fillOpacityObject*/ ctx[23][/*$key*/ ctx[115]])) {
    				attr_dev(text_1, "fill-opacity", text_1_fill_opacity_value);
    			}

    			if (dirty[0] & /*$tr_strokeOpacityObject, $tr_screenGeometryObject*/ 4325376 && text_1_stroke_opacity_value !== (text_1_stroke_opacity_value = /*$tr_strokeOpacityObject*/ ctx[22][/*$key*/ ctx[115]])) {
    				attr_dev(text_1, "stroke-opacity", text_1_stroke_opacity_value);
    			}

    			if (dirty[0] & /*$tr_opacityObject, $tr_screenGeometryObject*/ 16908288 && text_1_opacity_value !== (text_1_opacity_value = /*$tr_opacityObject*/ ctx[24][/*$key*/ ctx[115]])) {
    				attr_dev(text_1, "opacity", text_1_opacity_value);
    			}

    			if (dirty[0] & /*$tr_rotationObject, $tr_screenGeometryObject*/ 134348800 && text_1_transform_value !== (text_1_transform_value = `
          rotate(${/*$tr_rotationObject*/ ctx[27][/*$key*/ ctx[115]]}, 
          ${/*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[0]}, 
          ${/*$tr_screenGeometryObject*/ ctx[17][/*$key*/ ctx[115]].coordinates[1]})
        `)) {
    				attr_dev(text_1, "transform", text_1_transform_value);
    			}

    			if (dirty[0] & /*fontFamilyObject, $tr_screenGeometryObject*/ 147456 && text_1_font_family_value !== (text_1_font_family_value = /*fontFamilyObject*/ ctx[14][/*$key*/ ctx[115]])) {
    				attr_dev(text_1, "font-family", text_1_font_family_value);
    			}

    			if (dirty[0] & /*$tr_fontSizeObject, $tr_screenGeometryObject*/ 33685504 && text_1_font_size_value !== (text_1_font_size_value = /*$tr_fontSizeObject*/ ctx[25][/*$key*/ ctx[115]] + "px")) {
    				attr_dev(text_1, "font-size", text_1_font_size_value);
    			}

    			if (dirty[0] & /*$tr_fontWeightObject, $tr_screenGeometryObject*/ 67239936 && text_1_font_weight_value !== (text_1_font_weight_value = /*$tr_fontWeightObject*/ ctx[26][/*$key*/ ctx[115]])) {
    				attr_dev(text_1, "font-weight", text_1_font_weight_value);
    			}

    			if (dirty[0] & /*anchorPointObject, $tr_screenGeometryObject*/ 163840 && text_1_text_anchor_value !== (text_1_text_anchor_value = textAnchorPoint(/*anchorPointObject*/ ctx[15][/*$key*/ ctx[115]]).textAnchor)) {
    				attr_dev(text_1, "text-anchor", text_1_text_anchor_value);
    			}

    			if (dirty[0] & /*anchorPointObject, $tr_screenGeometryObject*/ 163840 && text_1_dominant_baseline_value !== (text_1_dominant_baseline_value = textAnchorPoint(/*anchorPointObject*/ ctx[15][/*$key*/ ctx[115]]).dominantBaseline)) {
    				attr_dev(text_1, "dominant-baseline", text_1_dominant_baseline_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(text_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(535:4) {#each Object.keys($tr_screenGeometryObject) as $key ($key)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let show_if = /*$graphicContext*/ ctx[32].output() === "svg";
    	let t;
    	let if_block1_anchor;
    	let if_block0 = show_if && create_if_block_1$2(ctx);
    	let if_block1 = /*renderLabel*/ ctx[31] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*$graphicContext*/ 2) show_if = /*$graphicContext*/ ctx[32].output() === "svg";

    			if (show_if) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*renderLabel*/ ctx[31]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$2(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: noop$2,
    		o: noop$2,
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    let idCounter = 0;

    function getId() {
    	return "layer" + idCounter++;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let isInteractiveMouse;
    	let isInteractiveTouch;
    	let isSelectable;
    	let renderPolygon;
    	let renderCircle;
    	let renderLine;
    	let renderLabel;
    	let $sectionContext;

    	let $tr_screenGeometryObject,
    		$$unsubscribe_tr_screenGeometryObject = noop$2,
    		$$subscribe_tr_screenGeometryObject = () => ($$unsubscribe_tr_screenGeometryObject(), $$unsubscribe_tr_screenGeometryObject = subscribe$4(tr_screenGeometryObject, $$value => $$invalidate(17, $tr_screenGeometryObject = $$value)), tr_screenGeometryObject);

    	let $tr_radiusObject,
    		$$unsubscribe_tr_radiusObject = noop$2,
    		$$subscribe_tr_radiusObject = () => ($$unsubscribe_tr_radiusObject(), $$unsubscribe_tr_radiusObject = subscribe$4(tr_radiusObject, $$value => $$invalidate(18, $tr_radiusObject = $$value)), tr_radiusObject);

    	let $tr_fillObject,
    		$$unsubscribe_tr_fillObject = noop$2,
    		$$subscribe_tr_fillObject = () => ($$unsubscribe_tr_fillObject(), $$unsubscribe_tr_fillObject = subscribe$4(tr_fillObject, $$value => $$invalidate(19, $tr_fillObject = $$value)), tr_fillObject);

    	let $tr_strokeObject,
    		$$unsubscribe_tr_strokeObject = noop$2,
    		$$subscribe_tr_strokeObject = () => ($$unsubscribe_tr_strokeObject(), $$unsubscribe_tr_strokeObject = subscribe$4(tr_strokeObject, $$value => $$invalidate(20, $tr_strokeObject = $$value)), tr_strokeObject);

    	let $tr_strokeWidthObject,
    		$$unsubscribe_tr_strokeWidthObject = noop$2,
    		$$subscribe_tr_strokeWidthObject = () => ($$unsubscribe_tr_strokeWidthObject(), $$unsubscribe_tr_strokeWidthObject = subscribe$4(tr_strokeWidthObject, $$value => $$invalidate(21, $tr_strokeWidthObject = $$value)), tr_strokeWidthObject);

    	let $tr_strokeOpacityObject,
    		$$unsubscribe_tr_strokeOpacityObject = noop$2,
    		$$subscribe_tr_strokeOpacityObject = () => ($$unsubscribe_tr_strokeOpacityObject(), $$unsubscribe_tr_strokeOpacityObject = subscribe$4(tr_strokeOpacityObject, $$value => $$invalidate(22, $tr_strokeOpacityObject = $$value)), tr_strokeOpacityObject);

    	let $tr_fillOpacityObject,
    		$$unsubscribe_tr_fillOpacityObject = noop$2,
    		$$subscribe_tr_fillOpacityObject = () => ($$unsubscribe_tr_fillOpacityObject(), $$unsubscribe_tr_fillOpacityObject = subscribe$4(tr_fillOpacityObject, $$value => $$invalidate(23, $tr_fillOpacityObject = $$value)), tr_fillOpacityObject);

    	let $tr_opacityObject,
    		$$unsubscribe_tr_opacityObject = noop$2,
    		$$subscribe_tr_opacityObject = () => ($$unsubscribe_tr_opacityObject(), $$unsubscribe_tr_opacityObject = subscribe$4(tr_opacityObject, $$value => $$invalidate(24, $tr_opacityObject = $$value)), tr_opacityObject);

    	let $tr_fontSizeObject,
    		$$unsubscribe_tr_fontSizeObject = noop$2,
    		$$subscribe_tr_fontSizeObject = () => ($$unsubscribe_tr_fontSizeObject(), $$unsubscribe_tr_fontSizeObject = subscribe$4(tr_fontSizeObject, $$value => $$invalidate(25, $tr_fontSizeObject = $$value)), tr_fontSizeObject);

    	let $tr_fontWeightObject,
    		$$unsubscribe_tr_fontWeightObject = noop$2,
    		$$subscribe_tr_fontWeightObject = () => ($$unsubscribe_tr_fontWeightObject(), $$unsubscribe_tr_fontWeightObject = subscribe$4(tr_fontWeightObject, $$value => $$invalidate(26, $tr_fontWeightObject = $$value)), tr_fontWeightObject);

    	let $tr_rotationObject,
    		$$unsubscribe_tr_rotationObject = noop$2,
    		$$subscribe_tr_rotationObject = () => ($$unsubscribe_tr_rotationObject(), $$unsubscribe_tr_rotationObject = subscribe$4(tr_rotationObject, $$value => $$invalidate(27, $tr_rotationObject = $$value)), tr_rotationObject);

    	let $interactionManagerContext;
    	let $graphicContext;
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_screenGeometryObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_radiusObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_fillObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_strokeObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_strokeWidthObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_strokeOpacityObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_fillOpacityObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_opacityObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_fontSizeObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_fontWeightObject());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_tr_rotationObject());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Layer", slots, []);
    	const layerId = getId();
    	let initPhase = true;
    	const initDone = () => !initPhase;
    	let { type } = $$props;
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { x1 = undefined } = $$props;
    	let { x2 = undefined } = $$props;
    	let { y1 = undefined } = $$props;
    	let { y2 = undefined } = $$props;
    	let { geometry = undefined } = $$props;
    	let { shape = undefined } = $$props;
    	let { size = undefined } = $$props;
    	let { independentAxis = undefined } = $$props;
    	let { radius = undefined } = $$props;
    	let { fill = undefined } = $$props;
    	let { stroke = undefined } = $$props;
    	let { strokeWidth = undefined } = $$props;
    	let { strokeOpacity = undefined } = $$props;
    	let { fillOpacity = undefined } = $$props;
    	let { opacity = undefined } = $$props;
    	let { text = undefined } = $$props;
    	let { fontFamily = undefined } = $$props;
    	let { fontSize = undefined } = $$props;
    	let { fontWeight = undefined } = $$props;
    	let { rotation = undefined } = $$props;
    	let { anchorPoint = undefined } = $$props;
    	let { transition = undefined } = $$props;
    	let { onClick = undefined } = $$props;
    	let { onMousedown = undefined } = $$props;
    	let { onMouseup = undefined } = $$props;
    	let { onMouseover = undefined } = $$props;
    	let { onMouseout = undefined } = $$props;
    	let { onMousedrag = undefined } = $$props;
    	let { onTouchdown = undefined } = $$props;
    	let { onTouchup = undefined } = $$props;
    	let { onTouchover = undefined } = $$props;
    	let { onTouchout = undefined } = $$props;
    	let { onTouchdrag = undefined } = $$props;
    	let { onSelect = undefined } = $$props;
    	let { onDeselect = undefined } = $$props;
    	let { key = undefined } = $$props;
    	let { renderSettings = undefined } = $$props;
    	let { blockReindexing = false } = $$props;
    	let { _asPolygon = true } = $$props;
    	let { clip } = $$props;

    	// Validate aesthetics every time input changes
    	let aesthetics = validateAesthetics(type, {
    		x,
    		y,
    		x1,
    		x2,
    		y1,
    		y2,
    		geometry,
    		shape,
    		size,
    		independentAxis,
    		radius,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		text,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		rotation,
    		anchorPoint
    	});

    	// Create 'positioning' aesthetics object
    	let positioningAesthetics = {
    		x,
    		y,
    		x1,
    		x2,
    		y1,
    		y2,
    		geometry,
    		shape,
    		size,
    		independentAxis
    	};

    	// Select appriopriate geometry conversion functions
    	let createPixelGeometryObject = layerPixelGeometryFuncs[type];

    	let representAsPolygonObject = layerRepresentAsPolygonFuncs[type];
    	let asPolygon = _asPolygon === true && layerRepresentAsPolygonFuncs[type] !== undefined;

    	// Contexts
    	const graphicContext = subscribe$3();

    	validate_store(graphicContext, "graphicContext");
    	component_subscribe($$self, graphicContext, value => $$invalidate(32, $graphicContext = value));
    	const sectionContext = subscribe$2();
    	validate_store(sectionContext, "sectionContext");
    	component_subscribe($$self, sectionContext, value => $$invalidate(12, $sectionContext = value));
    	const interactionManagerContext = subscribe();
    	validate_store(interactionManagerContext, "interactionManagerContext");
    	component_subscribe($$self, interactionManagerContext, value => $$invalidate(94, $interactionManagerContext = value));

    	// Initiate geometry objects and key array
    	let pixelGeometryObject;

    	let screenGeometryObject;
    	updatePixelGeometryObject();
    	let keyArray = Object.keys(pixelGeometryObject);

    	// Generate other prop objects
    	let radiusObject = generatePropObject(aesthetics.radius, keyArray);

    	const fillObject = generatePropObject(aesthetics.fill, keyArray);
    	const strokeObject = generatePropObject(aesthetics.stroke, keyArray);
    	let strokeWidthObject = generatePropObject(aesthetics.strokeWidth, keyArray);
    	const strokeOpacityObject = generatePropObject(aesthetics.strokeOpacity, keyArray);
    	const fillOpacityObject = generatePropObject(aesthetics.fillOpacity, keyArray);
    	const opacityObject = generatePropObject(aesthetics.opacity, keyArray);
    	let textObject = generatePropObject(aesthetics.text, keyArray);
    	let fontFamilyObject = generatePropObject(aesthetics.fontFamily, keyArray);
    	const fontSizeObject = generatePropObject(aesthetics.fontSize, keyArray);
    	const fontWeightObject = generatePropObject(aesthetics.fontWeight, keyArray);
    	const rotationObject = generatePropObject(aesthetics.rotation, keyArray);
    	let anchorPointObject = generatePropObject(aesthetics.anchorPoint, keyArray);

    	// This uses the radiusObject/strokeWidthObject in some cases, so must be done after the prop objects
    	updateScreenGeometryObject();

    	// Initiate transitionables
    	let tr_screenGeometryObject = createTransitionableLayer("geometry", screenGeometryObject, transition);

    	validate_store(tr_screenGeometryObject, "tr_screenGeometryObject");
    	$$subscribe_tr_screenGeometryObject();
    	let tr_radiusObject = createTransitionableLayer("radius", radiusObject, transition);
    	validate_store(tr_radiusObject, "tr_radiusObject");
    	$$subscribe_tr_radiusObject();
    	let tr_fillObject = createTransitionableLayer("fill", fillObject, transition);
    	validate_store(tr_fillObject, "tr_fillObject");
    	$$subscribe_tr_fillObject();
    	let tr_strokeObject = createTransitionableLayer("stroke", strokeObject, transition);
    	validate_store(tr_strokeObject, "tr_strokeObject");
    	$$subscribe_tr_strokeObject();
    	let tr_strokeWidthObject = createTransitionableLayer("strokeWidth", strokeWidthObject, transition);
    	validate_store(tr_strokeWidthObject, "tr_strokeWidthObject");
    	$$subscribe_tr_strokeWidthObject();
    	let tr_strokeOpacityObject = createTransitionableLayer("strokeOpacity", strokeOpacityObject, transition);
    	validate_store(tr_strokeOpacityObject, "tr_strokeOpacityObject");
    	$$subscribe_tr_strokeOpacityObject();
    	let tr_fillOpacityObject = createTransitionableLayer("fillOpacity", fillOpacityObject, transition);
    	validate_store(tr_fillOpacityObject, "tr_fillOpacityObject");
    	$$subscribe_tr_fillOpacityObject();
    	let tr_opacityObject = createTransitionableLayer("opacity", opacityObject, transition);
    	validate_store(tr_opacityObject, "tr_opacityObject");
    	$$subscribe_tr_opacityObject();

    	// text transtitionables
    	let tr_fontSizeObject = createTransitionableLayer("fontSize", fontSizeObject, transition);

    	validate_store(tr_fontSizeObject, "tr_fontSizeObject");
    	$$subscribe_tr_fontSizeObject();
    	let tr_fontWeightObject = createTransitionableLayer("fontWeight", fontWeightObject, transition);
    	validate_store(tr_fontWeightObject, "tr_fontWeightObject");
    	$$subscribe_tr_fontWeightObject();
    	let tr_rotationObject = createTransitionableLayer("rotation", rotationObject, transition);
    	validate_store(tr_rotationObject, "tr_rotationObject");
    	$$subscribe_tr_rotationObject();
    	let previousTransition;
    	let pixelGeometryObjectRecalculationNecessary = false;
    	let screenGeometryObjectRecalculationNecessary = false;

    	beforeUpdate(() => {
    		// Update transitionables
    		if (!transitionsEqual(previousTransition, transition) && initDone()) {
    			$$subscribe_tr_screenGeometryObject($$invalidate(16, tr_screenGeometryObject = createTransitionableLayer("geometry", $tr_screenGeometryObject, transition)));
    			$$subscribe_tr_radiusObject($$invalidate(2, tr_radiusObject = createTransitionableLayer("radius", $tr_radiusObject, transition)));
    			$$subscribe_tr_fillObject($$invalidate(3, tr_fillObject = createTransitionableLayer("fill", $tr_fillObject, transition)));
    			$$subscribe_tr_strokeObject($$invalidate(4, tr_strokeObject = createTransitionableLayer("stroke", $tr_strokeObject, transition)));
    			$$subscribe_tr_strokeWidthObject($$invalidate(5, tr_strokeWidthObject = createTransitionableLayer("strokeWidth", $tr_strokeWidthObject, transition)));
    			$$subscribe_tr_strokeOpacityObject($$invalidate(6, tr_strokeOpacityObject = createTransitionableLayer("strokeOpacity", $tr_strokeOpacityObject, transition)));
    			$$subscribe_tr_fillOpacityObject($$invalidate(7, tr_fillOpacityObject = createTransitionableLayer("fillOpacity", $tr_fillOpacityObject, transition)));
    			$$subscribe_tr_opacityObject($$invalidate(8, tr_opacityObject = createTransitionableLayer("opacity", $tr_opacityObject, transition)));
    			$$subscribe_tr_fontSizeObject($$invalidate(9, tr_fontSizeObject = createTransitionableLayer("fontSize", $tr_fontSizeObject, transition)));
    			$$subscribe_tr_fontWeightObject($$invalidate(10, tr_fontWeightObject = createTransitionableLayer("fontWeight", $tr_fontWeightObject, transition)));
    			$$subscribe_tr_rotationObject($$invalidate(11, tr_rotationObject = createTransitionableLayer("rotation", $tr_rotationObject, transition)));
    		}

    		previousTransition = transition;
    	});

    	afterUpdate(() => {
    		initPhase = false;
    	});

    	onMount(() => {
    		updateInteractionManagerIfNecessary();
    	});

    	onDestroy(() => {
    		removeLayerFromSpatialIndexIfNecessary();
    	});

    	// Helpers
    	function scheduleUpdatePixelGeometryObject() {
    		$$invalidate(82, pixelGeometryObjectRecalculationNecessary = true);
    		$$invalidate(83, screenGeometryObjectRecalculationNecessary = true);
    	}

    	function updatePixelGeometryObject() {
    		$$invalidate(80, pixelGeometryObject = createPixelGeometryObject(positioningAesthetics, key, $sectionContext, parseRenderSettings(renderSettings)));
    	}

    	function scheduleUpdateScreenGeometryObject() {
    		$$invalidate(83, screenGeometryObjectRecalculationNecessary = true);
    	}

    	function updateScreenGeometryObject() {
    		if (asPolygon) {
    			screenGeometryObject = representAsPolygonObject(pixelGeometryObject, { radiusObject, strokeWidthObject });
    		} else {
    			screenGeometryObject = pixelGeometryObject;
    		}
    	}

    	function updateScreenGeometryObjectTransitionable() {
    		tr_screenGeometryObject.set(screenGeometryObject);
    	}

    	function updateRadiusAndStrokeWidth() {
    		radiusObject = generatePropObject(aesthetics.radius, keyArray);
    		strokeWidthObject = generatePropObject(aesthetics.strokeWidth, keyArray);
    	}

    	function updateInteractionManagerIfNecessary() {
    		if (initPhase || !(blockReindexing || $sectionContext.blockReindexing)) {
    			removeLayerFromSpatialIndexIfNecessary();

    			if (isInteractiveMouse) {
    				const markInterface = $interactionManagerContext.mouse().marks();
    				markInterface.loadLayer(type, createDataNecessaryForIndexing());
    				if (onClick) markInterface.addLayerInteraction("click", layerId, onClick);
    				if (onMousedown) markInterface.addLayerInteraction("mousedown", layerId, onMousedown);
    				if (onMouseup) markInterface.addLayerInteraction("mouseup", layerId, onMouseup);
    				if (onMouseout) markInterface.addLayerInteraction("mouseout", layerId, onMouseout);
    				if (onMouseover) markInterface.addLayerInteraction("mouseover", layerId, onMouseover);
    				if (onMousedrag) markInterface.addLayerInteraction("mousedrag", layerId, onMousedrag);
    			}

    			if (isInteractiveTouch) {
    				const markInterface = $interactionManagerContext.touch().marks();
    				markInterface.loadLayer(type, createDataNecessaryForIndexing());
    				if (onTouchdown) markInterface.addLayerInteraction("touchdown", layerId, onTouchdown);
    				if (onTouchup) markInterface.addLayerInteraction("touchup", layerId, onTouchup);
    				if (onTouchover) markInterface.addLayerInteraction("touchover", layerId, onTouchover);
    				if (onTouchout) markInterface.addLayerInteraction("touchout", layerId, onTouchout);
    				if (onTouchdrag) markInterface.addLayerInteraction("touchdrag", layerId, onTouchdrag);
    			}
    		}

    		removeLayerFromSelectIfNecessary();

    		if (isSelectable) {
    			const selectManager = $interactionManagerContext.select();
    			selectManager.loadLayer(type, createDataNecessaryForIndexing(), { onSelect, onDeselect });
    		}
    	}

    	function removeLayerFromSpatialIndexIfNecessary() {
    		if (primaryInput === "mouse") {
    			const markMouseInterface = $interactionManagerContext.mouse().marks();

    			if (markMouseInterface.layerIsLoaded(layerId)) {
    				markMouseInterface.removeAllLayerInteractions(layerId);
    				markMouseInterface.removeLayer(layerId);
    			}
    		}

    		if (primaryInput === "touch") {
    			const markTouchInterface = $interactionManagerContext.touch().marks();

    			if (markTouchInterface.layerIsLoaded(layerId)) {
    				markTouchInterface.removeAllLayerInteractions(layerId);
    				markTouchInterface.removeLayer(layerId);
    			}
    		}
    	}

    	function removeLayerFromSelectIfNecessary() {
    		const selectManager = $interactionManagerContext.select();

    		if (selectManager.layerIsLoaded(layerId)) {
    			selectManager.removeLayer(layerId);
    		}
    	}

    	function createDataNecessaryForIndexing() {
    		return createDataNecessaryForIndexingLayer(
    			type,
    			layerId,
    			keyArray,
    			{
    				pixelGeometryObject,
    				screenGeometryObject
    			},
    			{ radiusObject, strokeWidthObject }
    		);
    	}

    	const writable_props = [
    		"type",
    		"x",
    		"y",
    		"x1",
    		"x2",
    		"y1",
    		"y2",
    		"geometry",
    		"shape",
    		"size",
    		"independentAxis",
    		"radius",
    		"fill",
    		"stroke",
    		"strokeWidth",
    		"strokeOpacity",
    		"fillOpacity",
    		"opacity",
    		"text",
    		"fontFamily",
    		"fontSize",
    		"fontWeight",
    		"rotation",
    		"anchorPoint",
    		"transition",
    		"onClick",
    		"onMousedown",
    		"onMouseup",
    		"onMouseover",
    		"onMouseout",
    		"onMousedrag",
    		"onTouchdown",
    		"onTouchup",
    		"onTouchover",
    		"onTouchout",
    		"onTouchdrag",
    		"onSelect",
    		"onDeselect",
    		"key",
    		"renderSettings",
    		"blockReindexing",
    		"_asPolygon",
    		"clip"
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Layer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("x" in $$props) $$invalidate(36, x = $$props.x);
    		if ("y" in $$props) $$invalidate(37, y = $$props.y);
    		if ("x1" in $$props) $$invalidate(38, x1 = $$props.x1);
    		if ("x2" in $$props) $$invalidate(39, x2 = $$props.x2);
    		if ("y1" in $$props) $$invalidate(40, y1 = $$props.y1);
    		if ("y2" in $$props) $$invalidate(41, y2 = $$props.y2);
    		if ("geometry" in $$props) $$invalidate(42, geometry = $$props.geometry);
    		if ("shape" in $$props) $$invalidate(43, shape = $$props.shape);
    		if ("size" in $$props) $$invalidate(44, size = $$props.size);
    		if ("independentAxis" in $$props) $$invalidate(45, independentAxis = $$props.independentAxis);
    		if ("radius" in $$props) $$invalidate(46, radius = $$props.radius);
    		if ("fill" in $$props) $$invalidate(47, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(48, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(49, strokeWidth = $$props.strokeWidth);
    		if ("strokeOpacity" in $$props) $$invalidate(50, strokeOpacity = $$props.strokeOpacity);
    		if ("fillOpacity" in $$props) $$invalidate(51, fillOpacity = $$props.fillOpacity);
    		if ("opacity" in $$props) $$invalidate(52, opacity = $$props.opacity);
    		if ("text" in $$props) $$invalidate(53, text = $$props.text);
    		if ("fontFamily" in $$props) $$invalidate(54, fontFamily = $$props.fontFamily);
    		if ("fontSize" in $$props) $$invalidate(55, fontSize = $$props.fontSize);
    		if ("fontWeight" in $$props) $$invalidate(56, fontWeight = $$props.fontWeight);
    		if ("rotation" in $$props) $$invalidate(57, rotation = $$props.rotation);
    		if ("anchorPoint" in $$props) $$invalidate(58, anchorPoint = $$props.anchorPoint);
    		if ("transition" in $$props) $$invalidate(59, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(60, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(61, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(62, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(63, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(64, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(65, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(66, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(67, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(68, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(69, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(70, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(71, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(72, onDeselect = $$props.onDeselect);
    		if ("key" in $$props) $$invalidate(73, key = $$props.key);
    		if ("renderSettings" in $$props) $$invalidate(74, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(75, blockReindexing = $$props.blockReindexing);
    		if ("_asPolygon" in $$props) $$invalidate(76, _asPolygon = $$props._asPolygon);
    		if ("clip" in $$props) $$invalidate(1, clip = $$props.clip);
    	};

    	$$self.$capture_state = () => ({
    		idCounter,
    		getId,
    		beforeUpdate,
    		afterUpdate,
    		onMount,
    		onDestroy,
    		tick,
    		detectIt,
    		GraphicContext: GraphicContext$1,
    		SectionContext,
    		InteractionManagerContext,
    		validateAesthetics,
    		layerPixelGeometryFuncs,
    		layerRepresentAsPolygonFuncs,
    		createTransitionableLayer,
    		transitionsEqual,
    		generatePropObject,
    		createDataNecessaryForIndexingLayer,
    		generatePath,
    		textAnchorPoint,
    		any,
    		parseRenderSettings,
    		layerId,
    		initPhase,
    		initDone,
    		type,
    		x,
    		y,
    		x1,
    		x2,
    		y1,
    		y2,
    		geometry,
    		shape,
    		size,
    		independentAxis,
    		radius,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		text,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		rotation,
    		anchorPoint,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		key,
    		renderSettings,
    		blockReindexing,
    		_asPolygon,
    		clip,
    		aesthetics,
    		positioningAesthetics,
    		createPixelGeometryObject,
    		representAsPolygonObject,
    		asPolygon,
    		graphicContext,
    		sectionContext,
    		interactionManagerContext,
    		pixelGeometryObject,
    		screenGeometryObject,
    		keyArray,
    		radiusObject,
    		fillObject,
    		strokeObject,
    		strokeWidthObject,
    		strokeOpacityObject,
    		fillOpacityObject,
    		opacityObject,
    		textObject,
    		fontFamilyObject,
    		fontSizeObject,
    		fontWeightObject,
    		rotationObject,
    		anchorPointObject,
    		tr_screenGeometryObject,
    		tr_radiusObject,
    		tr_fillObject,
    		tr_strokeObject,
    		tr_strokeWidthObject,
    		tr_strokeOpacityObject,
    		tr_fillOpacityObject,
    		tr_opacityObject,
    		tr_fontSizeObject,
    		tr_fontWeightObject,
    		tr_rotationObject,
    		previousTransition,
    		pixelGeometryObjectRecalculationNecessary,
    		screenGeometryObjectRecalculationNecessary,
    		scheduleUpdatePixelGeometryObject,
    		updatePixelGeometryObject,
    		scheduleUpdateScreenGeometryObject,
    		updateScreenGeometryObject,
    		updateScreenGeometryObjectTransitionable,
    		updateRadiusAndStrokeWidth,
    		updateInteractionManagerIfNecessary,
    		removeLayerFromSpatialIndexIfNecessary,
    		removeLayerFromSelectIfNecessary,
    		createDataNecessaryForIndexing,
    		$sectionContext,
    		$tr_screenGeometryObject,
    		$tr_radiusObject,
    		$tr_fillObject,
    		$tr_strokeObject,
    		$tr_strokeWidthObject,
    		$tr_strokeOpacityObject,
    		$tr_fillOpacityObject,
    		$tr_opacityObject,
    		$tr_fontSizeObject,
    		$tr_fontWeightObject,
    		$tr_rotationObject,
    		isInteractiveMouse,
    		isInteractiveTouch,
    		isSelectable,
    		$interactionManagerContext,
    		renderPolygon,
    		renderCircle,
    		renderLine,
    		renderLabel,
    		$graphicContext
    	});

    	$$self.$inject_state = $$props => {
    		if ("initPhase" in $$props) initPhase = $$props.initPhase;
    		if ("type" in $$props) $$invalidate(0, type = $$props.type);
    		if ("x" in $$props) $$invalidate(36, x = $$props.x);
    		if ("y" in $$props) $$invalidate(37, y = $$props.y);
    		if ("x1" in $$props) $$invalidate(38, x1 = $$props.x1);
    		if ("x2" in $$props) $$invalidate(39, x2 = $$props.x2);
    		if ("y1" in $$props) $$invalidate(40, y1 = $$props.y1);
    		if ("y2" in $$props) $$invalidate(41, y2 = $$props.y2);
    		if ("geometry" in $$props) $$invalidate(42, geometry = $$props.geometry);
    		if ("shape" in $$props) $$invalidate(43, shape = $$props.shape);
    		if ("size" in $$props) $$invalidate(44, size = $$props.size);
    		if ("independentAxis" in $$props) $$invalidate(45, independentAxis = $$props.independentAxis);
    		if ("radius" in $$props) $$invalidate(46, radius = $$props.radius);
    		if ("fill" in $$props) $$invalidate(47, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(48, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(49, strokeWidth = $$props.strokeWidth);
    		if ("strokeOpacity" in $$props) $$invalidate(50, strokeOpacity = $$props.strokeOpacity);
    		if ("fillOpacity" in $$props) $$invalidate(51, fillOpacity = $$props.fillOpacity);
    		if ("opacity" in $$props) $$invalidate(52, opacity = $$props.opacity);
    		if ("text" in $$props) $$invalidate(53, text = $$props.text);
    		if ("fontFamily" in $$props) $$invalidate(54, fontFamily = $$props.fontFamily);
    		if ("fontSize" in $$props) $$invalidate(55, fontSize = $$props.fontSize);
    		if ("fontWeight" in $$props) $$invalidate(56, fontWeight = $$props.fontWeight);
    		if ("rotation" in $$props) $$invalidate(57, rotation = $$props.rotation);
    		if ("anchorPoint" in $$props) $$invalidate(58, anchorPoint = $$props.anchorPoint);
    		if ("transition" in $$props) $$invalidate(59, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(60, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(61, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(62, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(63, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(64, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(65, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(66, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(67, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(68, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(69, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(70, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(71, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(72, onDeselect = $$props.onDeselect);
    		if ("key" in $$props) $$invalidate(73, key = $$props.key);
    		if ("renderSettings" in $$props) $$invalidate(74, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(75, blockReindexing = $$props.blockReindexing);
    		if ("_asPolygon" in $$props) $$invalidate(76, _asPolygon = $$props._asPolygon);
    		if ("clip" in $$props) $$invalidate(1, clip = $$props.clip);
    		if ("aesthetics" in $$props) $$invalidate(77, aesthetics = $$props.aesthetics);
    		if ("positioningAesthetics" in $$props) $$invalidate(78, positioningAesthetics = $$props.positioningAesthetics);
    		if ("createPixelGeometryObject" in $$props) createPixelGeometryObject = $$props.createPixelGeometryObject;
    		if ("representAsPolygonObject" in $$props) representAsPolygonObject = $$props.representAsPolygonObject;
    		if ("asPolygon" in $$props) $$invalidate(79, asPolygon = $$props.asPolygon);
    		if ("pixelGeometryObject" in $$props) $$invalidate(80, pixelGeometryObject = $$props.pixelGeometryObject);
    		if ("screenGeometryObject" in $$props) screenGeometryObject = $$props.screenGeometryObject;
    		if ("keyArray" in $$props) $$invalidate(81, keyArray = $$props.keyArray);
    		if ("radiusObject" in $$props) radiusObject = $$props.radiusObject;
    		if ("strokeWidthObject" in $$props) strokeWidthObject = $$props.strokeWidthObject;
    		if ("textObject" in $$props) $$invalidate(13, textObject = $$props.textObject);
    		if ("fontFamilyObject" in $$props) $$invalidate(14, fontFamilyObject = $$props.fontFamilyObject);
    		if ("anchorPointObject" in $$props) $$invalidate(15, anchorPointObject = $$props.anchorPointObject);
    		if ("tr_screenGeometryObject" in $$props) $$subscribe_tr_screenGeometryObject($$invalidate(16, tr_screenGeometryObject = $$props.tr_screenGeometryObject));
    		if ("tr_radiusObject" in $$props) $$subscribe_tr_radiusObject($$invalidate(2, tr_radiusObject = $$props.tr_radiusObject));
    		if ("tr_fillObject" in $$props) $$subscribe_tr_fillObject($$invalidate(3, tr_fillObject = $$props.tr_fillObject));
    		if ("tr_strokeObject" in $$props) $$subscribe_tr_strokeObject($$invalidate(4, tr_strokeObject = $$props.tr_strokeObject));
    		if ("tr_strokeWidthObject" in $$props) $$subscribe_tr_strokeWidthObject($$invalidate(5, tr_strokeWidthObject = $$props.tr_strokeWidthObject));
    		if ("tr_strokeOpacityObject" in $$props) $$subscribe_tr_strokeOpacityObject($$invalidate(6, tr_strokeOpacityObject = $$props.tr_strokeOpacityObject));
    		if ("tr_fillOpacityObject" in $$props) $$subscribe_tr_fillOpacityObject($$invalidate(7, tr_fillOpacityObject = $$props.tr_fillOpacityObject));
    		if ("tr_opacityObject" in $$props) $$subscribe_tr_opacityObject($$invalidate(8, tr_opacityObject = $$props.tr_opacityObject));
    		if ("tr_fontSizeObject" in $$props) $$subscribe_tr_fontSizeObject($$invalidate(9, tr_fontSizeObject = $$props.tr_fontSizeObject));
    		if ("tr_fontWeightObject" in $$props) $$subscribe_tr_fontWeightObject($$invalidate(10, tr_fontWeightObject = $$props.tr_fontWeightObject));
    		if ("tr_rotationObject" in $$props) $$subscribe_tr_rotationObject($$invalidate(11, tr_rotationObject = $$props.tr_rotationObject));
    		if ("previousTransition" in $$props) previousTransition = $$props.previousTransition;
    		if ("pixelGeometryObjectRecalculationNecessary" in $$props) $$invalidate(82, pixelGeometryObjectRecalculationNecessary = $$props.pixelGeometryObjectRecalculationNecessary);
    		if ("screenGeometryObjectRecalculationNecessary" in $$props) $$invalidate(83, screenGeometryObjectRecalculationNecessary = $$props.screenGeometryObjectRecalculationNecessary);
    		if ("isInteractiveMouse" in $$props) isInteractiveMouse = $$props.isInteractiveMouse;
    		if ("isInteractiveTouch" in $$props) isInteractiveTouch = $$props.isInteractiveTouch;
    		if ("isSelectable" in $$props) isSelectable = $$props.isSelectable;
    		if ("renderPolygon" in $$props) $$invalidate(28, renderPolygon = $$props.renderPolygon);
    		if ("renderCircle" in $$props) $$invalidate(29, renderCircle = $$props.renderCircle);
    		if ("renderLine" in $$props) $$invalidate(30, renderLine = $$props.renderLine);
    		if ("renderLabel" in $$props) $$invalidate(31, renderLabel = $$props.renderLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*type*/ 1 | $$self.$$.dirty[1] & /*x, y, x1, x2, y1, y2, geometry, shape, size, independentAxis, radius, fill, stroke, strokeWidth, strokeOpacity, fillOpacity, opacity, text, fontFamily, fontSize, fontWeight, rotation, anchorPoint*/ 268435424) {
    			{
    				if (initDone()) {
    					$$invalidate(77, aesthetics = validateAesthetics(type, {
    						x,
    						y,
    						x1,
    						x2,
    						y1,
    						y2,
    						geometry,
    						shape,
    						size,
    						independentAxis,
    						radius,
    						fill,
    						stroke,
    						strokeWidth,
    						strokeOpacity,
    						fillOpacity,
    						opacity,
    						text,
    						fontFamily,
    						fontSize,
    						fontWeight,
    						rotation,
    						anchorPoint
    					}));
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*x, y, x1, x2, y1, y2, geometry, shape, size, independentAxis*/ 32736) {
    			{
    				if (initDone()) {
    					$$invalidate(78, positioningAesthetics = {
    						x,
    						y,
    						x1,
    						x2,
    						y1,
    						y2,
    						geometry,
    						shape,
    						size,
    						independentAxis
    					});
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1) {
    			{
    				if (initDone()) {
    					createPixelGeometryObject = layerPixelGeometryFuncs[type];
    					representAsPolygonObject = layerRepresentAsPolygonFuncs[type];
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1 | $$self.$$.dirty[2] & /*_asPolygon*/ 16384) {
    			{
    				if (initDone()) {
    					$$invalidate(79, asPolygon = _asPolygon === true && layerRepresentAsPolygonFuncs[type] !== undefined);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$sectionContext*/ 4096 | $$self.$$.dirty[2] & /*positioningAesthetics, key, renderSettings*/ 71680) {
    			// Handle changes to geometry
    			{
    				if (initDone()) {
    					scheduleUpdatePixelGeometryObject(positioningAesthetics, key, $sectionContext, parseRenderSettings(renderSettings));
    				}
    			}
    		}

    		if ($$self.$$.dirty[2] & /*pixelGeometryObjectRecalculationNecessary, pixelGeometryObject, screenGeometryObjectRecalculationNecessary*/ 3407872) {
    			{
    				tick().then(() => {
    					if (pixelGeometryObjectRecalculationNecessary) {
    						updatePixelGeometryObject();
    						$$invalidate(81, keyArray = Object.keys(pixelGeometryObject));
    						updateRadiusAndStrokeWidth();
    					}

    					if (screenGeometryObjectRecalculationNecessary) {
    						updateScreenGeometryObject();
    						updateScreenGeometryObjectTransitionable();
    						updateInteractionManagerIfNecessary();
    					}

    					$$invalidate(82, pixelGeometryObjectRecalculationNecessary = false);
    					$$invalidate(83, screenGeometryObjectRecalculationNecessary = false);
    				});
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_radiusObject, tr_strokeWidthObject*/ 36 | $$self.$$.dirty[2] & /*asPolygon, aesthetics, keyArray*/ 688128) {
    			// Handle radius and strokeWidth changes if Points or Lines are not represented as Polygons
    			{
    				if (initDone()) {
    					if (!asPolygon) {
    						tr_radiusObject.set(generatePropObject(aesthetics.radius, keyArray));
    						tr_strokeWidthObject.set(generatePropObject(aesthetics.strokeWidth, keyArray));
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_fillObject*/ 8 | $$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			// Handle other changes
    			{
    				if (initDone()) tr_fillObject.set(generatePropObject(aesthetics.fill, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_strokeObject*/ 16 | $$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			{
    				if (initDone()) tr_strokeObject.set(generatePropObject(aesthetics.stroke, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_strokeOpacityObject*/ 64 | $$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			{
    				if (initDone()) tr_strokeOpacityObject.set(generatePropObject(aesthetics.strokeOpacity, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_fillOpacityObject*/ 128 | $$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			{
    				if (initDone()) tr_fillOpacityObject.set(generatePropObject(aesthetics.fillOpacity, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_opacityObject*/ 256 | $$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			{
    				if (initDone()) tr_opacityObject.set(generatePropObject(aesthetics.opacity, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_fontSizeObject*/ 512 | $$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			// text aes changes
    			{
    				if (initDone()) tr_fontSizeObject.set(generatePropObject(aesthetics.fontSize, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_fontWeightObject*/ 1024 | $$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			{
    				if (initDone()) tr_fontWeightObject.set(generatePropObject(aesthetics.fontWeight, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[0] & /*tr_rotationObject*/ 2048 | $$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			{
    				if (initDone()) tr_rotationObject.set(generatePropObject(aesthetics.rotation, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			// non-transitionable aesthetics
    			{
    				if (initDone()) $$invalidate(13, textObject = generatePropObject(aesthetics.text, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			{
    				if (initDone()) $$invalidate(14, fontFamilyObject = generatePropObject(aesthetics.fontFamily, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[2] & /*aesthetics, keyArray*/ 557056) {
    			{
    				if (initDone()) $$invalidate(15, anchorPointObject = generatePropObject(aesthetics.anchorPoint, keyArray));
    			}
    		}

    		if ($$self.$$.dirty[1] & /*onClick, onMousedown*/ 1610612736 | $$self.$$.dirty[2] & /*onMouseup, onMouseover, onMouseout, onMousedrag*/ 15) {
    			// Interactivity
    			isInteractiveMouse = primaryInput === "mouse" && any(onClick, onMousedown, onMouseup, onMouseover, onMouseout, onMousedrag);
    		}

    		if ($$self.$$.dirty[2] & /*onTouchdown, onTouchup, onTouchover, onTouchout, onTouchdrag*/ 496) {
    			isInteractiveTouch = primaryInput === "touch" && any(onTouchdown, onTouchup, onTouchover, onTouchout, onTouchdrag);
    		}

    		if ($$self.$$.dirty[2] & /*onSelect, onDeselect*/ 1536) {
    			isSelectable = onSelect !== undefined || onDeselect !== undefined;
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1 | $$self.$$.dirty[2] & /*asPolygon*/ 131072) {
    			$$invalidate(28, renderPolygon = !["Point", "Line", "Label"].includes(type) || asPolygon);
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1 | $$self.$$.dirty[2] & /*asPolygon*/ 131072) {
    			$$invalidate(29, renderCircle = type === "Point" && !asPolygon);
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1 | $$self.$$.dirty[2] & /*asPolygon*/ 131072) {
    			$$invalidate(30, renderLine = type === "Line" && !asPolygon);
    		}

    		if ($$self.$$.dirty[0] & /*type*/ 1) {
    			$$invalidate(31, renderLabel = type === "Label");
    		}
    	};

    	return [
    		type,
    		clip,
    		tr_radiusObject,
    		tr_fillObject,
    		tr_strokeObject,
    		tr_strokeWidthObject,
    		tr_strokeOpacityObject,
    		tr_fillOpacityObject,
    		tr_opacityObject,
    		tr_fontSizeObject,
    		tr_fontWeightObject,
    		tr_rotationObject,
    		$sectionContext,
    		textObject,
    		fontFamilyObject,
    		anchorPointObject,
    		tr_screenGeometryObject,
    		$tr_screenGeometryObject,
    		$tr_radiusObject,
    		$tr_fillObject,
    		$tr_strokeObject,
    		$tr_strokeWidthObject,
    		$tr_strokeOpacityObject,
    		$tr_fillOpacityObject,
    		$tr_opacityObject,
    		$tr_fontSizeObject,
    		$tr_fontWeightObject,
    		$tr_rotationObject,
    		renderPolygon,
    		renderCircle,
    		renderLine,
    		renderLabel,
    		$graphicContext,
    		graphicContext,
    		sectionContext,
    		interactionManagerContext,
    		x,
    		y,
    		x1,
    		x2,
    		y1,
    		y2,
    		geometry,
    		shape,
    		size,
    		independentAxis,
    		radius,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		text,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		rotation,
    		anchorPoint,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		key,
    		renderSettings,
    		blockReindexing,
    		_asPolygon,
    		aesthetics,
    		positioningAesthetics,
    		asPolygon,
    		pixelGeometryObject,
    		keyArray,
    		pixelGeometryObjectRecalculationNecessary,
    		screenGeometryObjectRecalculationNecessary
    	];
    }

    class Layer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				type: 0,
    				x: 36,
    				y: 37,
    				x1: 38,
    				x2: 39,
    				y1: 40,
    				y2: 41,
    				geometry: 42,
    				shape: 43,
    				size: 44,
    				independentAxis: 45,
    				radius: 46,
    				fill: 47,
    				stroke: 48,
    				strokeWidth: 49,
    				strokeOpacity: 50,
    				fillOpacity: 51,
    				opacity: 52,
    				text: 53,
    				fontFamily: 54,
    				fontSize: 55,
    				fontWeight: 56,
    				rotation: 57,
    				anchorPoint: 58,
    				transition: 59,
    				onClick: 60,
    				onMousedown: 61,
    				onMouseup: 62,
    				onMouseover: 63,
    				onMouseout: 64,
    				onMousedrag: 65,
    				onTouchdown: 66,
    				onTouchup: 67,
    				onTouchover: 68,
    				onTouchout: 69,
    				onTouchdrag: 70,
    				onSelect: 71,
    				onDeselect: 72,
    				key: 73,
    				renderSettings: 74,
    				blockReindexing: 75,
    				_asPolygon: 76,
    				clip: 1
    			},
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Layer",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*type*/ ctx[0] === undefined && !("type" in props)) {
    			console.warn("<Layer> was created without expected prop 'type'");
    		}

    		if (/*clip*/ ctx[1] === undefined && !("clip" in props)) {
    			console.warn("<Layer> was created without expected prop 'clip'");
    		}
    	}

    	get type() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x1() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x1(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x2() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x2(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y1() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y1(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y2() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y2(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get geometry() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set geometry(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shape() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shape(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get independentAxis() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set independentAxis(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get radius() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set radius(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeOpacity() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeOpacity(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fillOpacity() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fillOpacity(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontFamily() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontFamily(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontSize() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontSize(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontWeight() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontWeight(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotation() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotation(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchorPoint() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchorPoint(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedown() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedown(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseup() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseup(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseover() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseover(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseout() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseout(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedrag() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedrag(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdown() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdown(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchup() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchup(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchover() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchover(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchout() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchout(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdrag() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdrag(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSelect() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSelect(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDeselect() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDeselect(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderSettings() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderSettings(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blockReindexing() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blockReindexing(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get _asPolygon() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set _asPolygon(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clip() {
    		throw new Error("<Layer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clip(value) {
    		throw new Error("<Layer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@snlab/florence/src/components/Marks/Line/LineLayer.svelte generated by Svelte v3.37.0 */

    function create_fragment$6(ctx) {
    	let layer;
    	let current;

    	layer = new Layer({
    			props: {
    				type: "Line",
    				x: /*x*/ ctx[0],
    				y: /*y*/ ctx[1],
    				geometry: /*geometry*/ ctx[2],
    				strokeWidth: /*strokeWidth*/ ctx[3],
    				stroke: /*stroke*/ ctx[4],
    				opacity: /*opacity*/ ctx[5],
    				transition: /*transition*/ ctx[6],
    				onClick: /*onClick*/ ctx[7],
    				onMousedown: /*onMousedown*/ ctx[8],
    				onMouseup: /*onMouseup*/ ctx[9],
    				onMouseover: /*onMouseover*/ ctx[10],
    				onMouseout: /*onMouseout*/ ctx[11],
    				onMousedrag: /*onMousedrag*/ ctx[12],
    				onTouchdown: /*onTouchdown*/ ctx[13],
    				onTouchup: /*onTouchup*/ ctx[14],
    				onTouchover: /*onTouchover*/ ctx[15],
    				onTouchout: /*onTouchout*/ ctx[16],
    				onTouchdrag: /*onTouchdrag*/ ctx[17],
    				onSelect: /*onSelect*/ ctx[18],
    				onDeselect: /*onDeselect*/ ctx[19],
    				key: /*key*/ ctx[20],
    				renderSettings: /*renderSettings*/ ctx[21],
    				blockReindexing: /*blockReindexing*/ ctx[22],
    				clip: /*clip*/ ctx[23],
    				_asPolygon: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(layer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const layer_changes = {};
    			if (dirty & /*x*/ 1) layer_changes.x = /*x*/ ctx[0];
    			if (dirty & /*y*/ 2) layer_changes.y = /*y*/ ctx[1];
    			if (dirty & /*geometry*/ 4) layer_changes.geometry = /*geometry*/ ctx[2];
    			if (dirty & /*strokeWidth*/ 8) layer_changes.strokeWidth = /*strokeWidth*/ ctx[3];
    			if (dirty & /*stroke*/ 16) layer_changes.stroke = /*stroke*/ ctx[4];
    			if (dirty & /*opacity*/ 32) layer_changes.opacity = /*opacity*/ ctx[5];
    			if (dirty & /*transition*/ 64) layer_changes.transition = /*transition*/ ctx[6];
    			if (dirty & /*onClick*/ 128) layer_changes.onClick = /*onClick*/ ctx[7];
    			if (dirty & /*onMousedown*/ 256) layer_changes.onMousedown = /*onMousedown*/ ctx[8];
    			if (dirty & /*onMouseup*/ 512) layer_changes.onMouseup = /*onMouseup*/ ctx[9];
    			if (dirty & /*onMouseover*/ 1024) layer_changes.onMouseover = /*onMouseover*/ ctx[10];
    			if (dirty & /*onMouseout*/ 2048) layer_changes.onMouseout = /*onMouseout*/ ctx[11];
    			if (dirty & /*onMousedrag*/ 4096) layer_changes.onMousedrag = /*onMousedrag*/ ctx[12];
    			if (dirty & /*onTouchdown*/ 8192) layer_changes.onTouchdown = /*onTouchdown*/ ctx[13];
    			if (dirty & /*onTouchup*/ 16384) layer_changes.onTouchup = /*onTouchup*/ ctx[14];
    			if (dirty & /*onTouchover*/ 32768) layer_changes.onTouchover = /*onTouchover*/ ctx[15];
    			if (dirty & /*onTouchout*/ 65536) layer_changes.onTouchout = /*onTouchout*/ ctx[16];
    			if (dirty & /*onTouchdrag*/ 131072) layer_changes.onTouchdrag = /*onTouchdrag*/ ctx[17];
    			if (dirty & /*onSelect*/ 262144) layer_changes.onSelect = /*onSelect*/ ctx[18];
    			if (dirty & /*onDeselect*/ 524288) layer_changes.onDeselect = /*onDeselect*/ ctx[19];
    			if (dirty & /*key*/ 1048576) layer_changes.key = /*key*/ ctx[20];
    			if (dirty & /*renderSettings*/ 2097152) layer_changes.renderSettings = /*renderSettings*/ ctx[21];
    			if (dirty & /*blockReindexing*/ 4194304) layer_changes.blockReindexing = /*blockReindexing*/ ctx[22];
    			if (dirty & /*clip*/ 8388608) layer_changes.clip = /*clip*/ ctx[23];
    			layer.$set(layer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LineLayer", slots, []);
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { geometry = undefined } = $$props;
    	let { strokeWidth = undefined } = $$props;
    	let { stroke = undefined } = $$props;
    	let { opacity = undefined } = $$props;
    	let { transition = undefined } = $$props;
    	let { onClick = undefined } = $$props;
    	let { onMousedown = undefined } = $$props;
    	let { onMouseup = undefined } = $$props;
    	let { onMouseover = undefined } = $$props;
    	let { onMouseout = undefined } = $$props;
    	let { onMousedrag = undefined } = $$props;
    	let { onTouchdown = undefined } = $$props;
    	let { onTouchup = undefined } = $$props;
    	let { onTouchover = undefined } = $$props;
    	let { onTouchout = undefined } = $$props;
    	let { onTouchdrag = undefined } = $$props;
    	let { onSelect = undefined } = $$props;
    	let { onDeselect = undefined } = $$props;
    	let { key = undefined } = $$props;
    	let { renderSettings = undefined } = $$props;
    	let { blockReindexing = false } = $$props;
    	let { clip = true } = $$props;

    	const writable_props = [
    		"x",
    		"y",
    		"geometry",
    		"strokeWidth",
    		"stroke",
    		"opacity",
    		"transition",
    		"onClick",
    		"onMousedown",
    		"onMouseup",
    		"onMouseover",
    		"onMouseout",
    		"onMousedrag",
    		"onTouchdown",
    		"onTouchup",
    		"onTouchover",
    		"onTouchout",
    		"onTouchdrag",
    		"onSelect",
    		"onDeselect",
    		"key",
    		"renderSettings",
    		"blockReindexing",
    		"clip"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LineLayer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("geometry" in $$props) $$invalidate(2, geometry = $$props.geometry);
    		if ("strokeWidth" in $$props) $$invalidate(3, strokeWidth = $$props.strokeWidth);
    		if ("stroke" in $$props) $$invalidate(4, stroke = $$props.stroke);
    		if ("opacity" in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ("transition" in $$props) $$invalidate(6, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(7, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(8, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(9, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(10, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(11, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(12, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(13, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(14, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(15, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(16, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(17, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(18, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(19, onDeselect = $$props.onDeselect);
    		if ("key" in $$props) $$invalidate(20, key = $$props.key);
    		if ("renderSettings" in $$props) $$invalidate(21, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(22, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(23, clip = $$props.clip);
    	};

    	$$self.$capture_state = () => ({
    		Layer,
    		x,
    		y,
    		geometry,
    		strokeWidth,
    		stroke,
    		opacity,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		key,
    		renderSettings,
    		blockReindexing,
    		clip
    	});

    	$$self.$inject_state = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("geometry" in $$props) $$invalidate(2, geometry = $$props.geometry);
    		if ("strokeWidth" in $$props) $$invalidate(3, strokeWidth = $$props.strokeWidth);
    		if ("stroke" in $$props) $$invalidate(4, stroke = $$props.stroke);
    		if ("opacity" in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ("transition" in $$props) $$invalidate(6, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(7, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(8, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(9, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(10, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(11, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(12, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(13, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(14, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(15, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(16, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(17, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(18, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(19, onDeselect = $$props.onDeselect);
    		if ("key" in $$props) $$invalidate(20, key = $$props.key);
    		if ("renderSettings" in $$props) $$invalidate(21, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(22, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(23, clip = $$props.clip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		x,
    		y,
    		geometry,
    		strokeWidth,
    		stroke,
    		opacity,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		key,
    		renderSettings,
    		blockReindexing,
    		clip
    	];
    }

    class LineLayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			x: 0,
    			y: 1,
    			geometry: 2,
    			strokeWidth: 3,
    			stroke: 4,
    			opacity: 5,
    			transition: 6,
    			onClick: 7,
    			onMousedown: 8,
    			onMouseup: 9,
    			onMouseover: 10,
    			onMouseout: 11,
    			onMousedrag: 12,
    			onTouchdown: 13,
    			onTouchup: 14,
    			onTouchover: 15,
    			onTouchout: 16,
    			onTouchdrag: 17,
    			onSelect: 18,
    			onDeselect: 19,
    			key: 20,
    			renderSettings: 21,
    			blockReindexing: 22,
    			clip: 23
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LineLayer",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get x() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get geometry() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set geometry(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedown() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedown(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseup() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseup(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseover() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseover(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseout() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseout(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedrag() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedrag(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdown() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdown(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchup() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchup(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchover() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchover(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchout() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchout(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdrag() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdrag(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSelect() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSelect(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDeselect() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDeselect(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderSettings() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderSettings(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blockReindexing() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blockReindexing(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clip() {
    		throw new Error("<LineLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clip(value) {
    		throw new Error("<LineLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@snlab/florence/src/components/Marks/Label/LabelLayer.svelte generated by Svelte v3.37.0 */

    function create_fragment$5(ctx) {
    	let layer;
    	let current;

    	layer = new Layer({
    			props: {
    				type: "Label",
    				x: /*x*/ ctx[0],
    				y: /*y*/ ctx[1],
    				geometry: /*geometry*/ ctx[2],
    				fill: /*fill*/ ctx[3],
    				stroke: /*stroke*/ ctx[4],
    				strokeWidth: /*strokeWidth*/ ctx[5],
    				strokeOpacity: /*strokeOpacity*/ ctx[6],
    				fillOpacity: /*fillOpacity*/ ctx[7],
    				opacity: /*opacity*/ ctx[8],
    				text: /*text*/ ctx[9],
    				fontFamily: /*fontFamily*/ ctx[10],
    				fontSize: /*fontSize*/ ctx[11],
    				fontWeight: /*fontWeight*/ ctx[12],
    				rotation: /*rotation*/ ctx[13],
    				anchorPoint: /*anchorPoint*/ ctx[14],
    				transition: /*transition*/ ctx[15],
    				onClick: /*onClick*/ ctx[16],
    				onMousedown: /*onMousedown*/ ctx[17],
    				onMouseup: /*onMouseup*/ ctx[18],
    				onMouseover: /*onMouseover*/ ctx[19],
    				onMouseout: /*onMouseout*/ ctx[20],
    				onMousedrag: /*onMousedrag*/ ctx[21],
    				onTouchdown: /*onTouchdown*/ ctx[22],
    				onTouchup: /*onTouchup*/ ctx[23],
    				onTouchover: /*onTouchover*/ ctx[24],
    				onTouchout: /*onTouchout*/ ctx[25],
    				onTouchdrag: /*onTouchdrag*/ ctx[26],
    				onSelect: /*onSelect*/ ctx[27],
    				onDeselect: /*onDeselect*/ ctx[28],
    				key: /*key*/ ctx[29],
    				renderSettings: /*renderSettings*/ ctx[30],
    				blockReindexing: /*blockReindexing*/ ctx[31],
    				clip: /*clip*/ ctx[32],
    				_asPolygon: false
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(layer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(layer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const layer_changes = {};
    			if (dirty[0] & /*x*/ 1) layer_changes.x = /*x*/ ctx[0];
    			if (dirty[0] & /*y*/ 2) layer_changes.y = /*y*/ ctx[1];
    			if (dirty[0] & /*geometry*/ 4) layer_changes.geometry = /*geometry*/ ctx[2];
    			if (dirty[0] & /*fill*/ 8) layer_changes.fill = /*fill*/ ctx[3];
    			if (dirty[0] & /*stroke*/ 16) layer_changes.stroke = /*stroke*/ ctx[4];
    			if (dirty[0] & /*strokeWidth*/ 32) layer_changes.strokeWidth = /*strokeWidth*/ ctx[5];
    			if (dirty[0] & /*strokeOpacity*/ 64) layer_changes.strokeOpacity = /*strokeOpacity*/ ctx[6];
    			if (dirty[0] & /*fillOpacity*/ 128) layer_changes.fillOpacity = /*fillOpacity*/ ctx[7];
    			if (dirty[0] & /*opacity*/ 256) layer_changes.opacity = /*opacity*/ ctx[8];
    			if (dirty[0] & /*text*/ 512) layer_changes.text = /*text*/ ctx[9];
    			if (dirty[0] & /*fontFamily*/ 1024) layer_changes.fontFamily = /*fontFamily*/ ctx[10];
    			if (dirty[0] & /*fontSize*/ 2048) layer_changes.fontSize = /*fontSize*/ ctx[11];
    			if (dirty[0] & /*fontWeight*/ 4096) layer_changes.fontWeight = /*fontWeight*/ ctx[12];
    			if (dirty[0] & /*rotation*/ 8192) layer_changes.rotation = /*rotation*/ ctx[13];
    			if (dirty[0] & /*anchorPoint*/ 16384) layer_changes.anchorPoint = /*anchorPoint*/ ctx[14];
    			if (dirty[0] & /*transition*/ 32768) layer_changes.transition = /*transition*/ ctx[15];
    			if (dirty[0] & /*onClick*/ 65536) layer_changes.onClick = /*onClick*/ ctx[16];
    			if (dirty[0] & /*onMousedown*/ 131072) layer_changes.onMousedown = /*onMousedown*/ ctx[17];
    			if (dirty[0] & /*onMouseup*/ 262144) layer_changes.onMouseup = /*onMouseup*/ ctx[18];
    			if (dirty[0] & /*onMouseover*/ 524288) layer_changes.onMouseover = /*onMouseover*/ ctx[19];
    			if (dirty[0] & /*onMouseout*/ 1048576) layer_changes.onMouseout = /*onMouseout*/ ctx[20];
    			if (dirty[0] & /*onMousedrag*/ 2097152) layer_changes.onMousedrag = /*onMousedrag*/ ctx[21];
    			if (dirty[0] & /*onTouchdown*/ 4194304) layer_changes.onTouchdown = /*onTouchdown*/ ctx[22];
    			if (dirty[0] & /*onTouchup*/ 8388608) layer_changes.onTouchup = /*onTouchup*/ ctx[23];
    			if (dirty[0] & /*onTouchover*/ 16777216) layer_changes.onTouchover = /*onTouchover*/ ctx[24];
    			if (dirty[0] & /*onTouchout*/ 33554432) layer_changes.onTouchout = /*onTouchout*/ ctx[25];
    			if (dirty[0] & /*onTouchdrag*/ 67108864) layer_changes.onTouchdrag = /*onTouchdrag*/ ctx[26];
    			if (dirty[0] & /*onSelect*/ 134217728) layer_changes.onSelect = /*onSelect*/ ctx[27];
    			if (dirty[0] & /*onDeselect*/ 268435456) layer_changes.onDeselect = /*onDeselect*/ ctx[28];
    			if (dirty[0] & /*key*/ 536870912) layer_changes.key = /*key*/ ctx[29];
    			if (dirty[0] & /*renderSettings*/ 1073741824) layer_changes.renderSettings = /*renderSettings*/ ctx[30];
    			if (dirty[1] & /*blockReindexing*/ 1) layer_changes.blockReindexing = /*blockReindexing*/ ctx[31];
    			if (dirty[1] & /*clip*/ 2) layer_changes.clip = /*clip*/ ctx[32];
    			layer.$set(layer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(layer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(layer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(layer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("LabelLayer", slots, []);
    	let { x = undefined } = $$props;
    	let { y = undefined } = $$props;
    	let { geometry = undefined } = $$props;
    	let { fill = undefined } = $$props;
    	let { stroke = undefined } = $$props;
    	let { strokeWidth = undefined } = $$props;
    	let { strokeOpacity = undefined } = $$props;
    	let { fillOpacity = undefined } = $$props;
    	let { opacity = undefined } = $$props;
    	let { text = undefined } = $$props;
    	let { fontFamily = undefined } = $$props;
    	let { fontSize = undefined } = $$props;
    	let { fontWeight = undefined } = $$props;
    	let { rotation = undefined } = $$props;
    	let { anchorPoint = undefined } = $$props;
    	let { transition = undefined } = $$props;
    	let { onClick = undefined } = $$props;
    	let { onMousedown = undefined } = $$props;
    	let { onMouseup = undefined } = $$props;
    	let { onMouseover = undefined } = $$props;
    	let { onMouseout = undefined } = $$props;
    	let { onMousedrag = undefined } = $$props;
    	let { onTouchdown = undefined } = $$props;
    	let { onTouchup = undefined } = $$props;
    	let { onTouchover = undefined } = $$props;
    	let { onTouchout = undefined } = $$props;
    	let { onTouchdrag = undefined } = $$props;
    	let { onSelect = undefined } = $$props;
    	let { onDeselect = undefined } = $$props;
    	let { key = undefined } = $$props;
    	let { renderSettings = undefined } = $$props;
    	let { blockReindexing = false } = $$props;
    	let { clip = true } = $$props;

    	const writable_props = [
    		"x",
    		"y",
    		"geometry",
    		"fill",
    		"stroke",
    		"strokeWidth",
    		"strokeOpacity",
    		"fillOpacity",
    		"opacity",
    		"text",
    		"fontFamily",
    		"fontSize",
    		"fontWeight",
    		"rotation",
    		"anchorPoint",
    		"transition",
    		"onClick",
    		"onMousedown",
    		"onMouseup",
    		"onMouseover",
    		"onMouseout",
    		"onMousedrag",
    		"onTouchdown",
    		"onTouchup",
    		"onTouchover",
    		"onTouchout",
    		"onTouchdrag",
    		"onSelect",
    		"onDeselect",
    		"key",
    		"renderSettings",
    		"blockReindexing",
    		"clip"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LabelLayer> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("geometry" in $$props) $$invalidate(2, geometry = $$props.geometry);
    		if ("fill" in $$props) $$invalidate(3, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(4, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(5, strokeWidth = $$props.strokeWidth);
    		if ("strokeOpacity" in $$props) $$invalidate(6, strokeOpacity = $$props.strokeOpacity);
    		if ("fillOpacity" in $$props) $$invalidate(7, fillOpacity = $$props.fillOpacity);
    		if ("opacity" in $$props) $$invalidate(8, opacity = $$props.opacity);
    		if ("text" in $$props) $$invalidate(9, text = $$props.text);
    		if ("fontFamily" in $$props) $$invalidate(10, fontFamily = $$props.fontFamily);
    		if ("fontSize" in $$props) $$invalidate(11, fontSize = $$props.fontSize);
    		if ("fontWeight" in $$props) $$invalidate(12, fontWeight = $$props.fontWeight);
    		if ("rotation" in $$props) $$invalidate(13, rotation = $$props.rotation);
    		if ("anchorPoint" in $$props) $$invalidate(14, anchorPoint = $$props.anchorPoint);
    		if ("transition" in $$props) $$invalidate(15, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(16, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(17, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(18, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(19, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(20, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(21, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(22, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(23, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(24, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(25, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(26, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(27, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(28, onDeselect = $$props.onDeselect);
    		if ("key" in $$props) $$invalidate(29, key = $$props.key);
    		if ("renderSettings" in $$props) $$invalidate(30, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(31, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(32, clip = $$props.clip);
    	};

    	$$self.$capture_state = () => ({
    		Layer,
    		x,
    		y,
    		geometry,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		text,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		rotation,
    		anchorPoint,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		key,
    		renderSettings,
    		blockReindexing,
    		clip
    	});

    	$$self.$inject_state = $$props => {
    		if ("x" in $$props) $$invalidate(0, x = $$props.x);
    		if ("y" in $$props) $$invalidate(1, y = $$props.y);
    		if ("geometry" in $$props) $$invalidate(2, geometry = $$props.geometry);
    		if ("fill" in $$props) $$invalidate(3, fill = $$props.fill);
    		if ("stroke" in $$props) $$invalidate(4, stroke = $$props.stroke);
    		if ("strokeWidth" in $$props) $$invalidate(5, strokeWidth = $$props.strokeWidth);
    		if ("strokeOpacity" in $$props) $$invalidate(6, strokeOpacity = $$props.strokeOpacity);
    		if ("fillOpacity" in $$props) $$invalidate(7, fillOpacity = $$props.fillOpacity);
    		if ("opacity" in $$props) $$invalidate(8, opacity = $$props.opacity);
    		if ("text" in $$props) $$invalidate(9, text = $$props.text);
    		if ("fontFamily" in $$props) $$invalidate(10, fontFamily = $$props.fontFamily);
    		if ("fontSize" in $$props) $$invalidate(11, fontSize = $$props.fontSize);
    		if ("fontWeight" in $$props) $$invalidate(12, fontWeight = $$props.fontWeight);
    		if ("rotation" in $$props) $$invalidate(13, rotation = $$props.rotation);
    		if ("anchorPoint" in $$props) $$invalidate(14, anchorPoint = $$props.anchorPoint);
    		if ("transition" in $$props) $$invalidate(15, transition = $$props.transition);
    		if ("onClick" in $$props) $$invalidate(16, onClick = $$props.onClick);
    		if ("onMousedown" in $$props) $$invalidate(17, onMousedown = $$props.onMousedown);
    		if ("onMouseup" in $$props) $$invalidate(18, onMouseup = $$props.onMouseup);
    		if ("onMouseover" in $$props) $$invalidate(19, onMouseover = $$props.onMouseover);
    		if ("onMouseout" in $$props) $$invalidate(20, onMouseout = $$props.onMouseout);
    		if ("onMousedrag" in $$props) $$invalidate(21, onMousedrag = $$props.onMousedrag);
    		if ("onTouchdown" in $$props) $$invalidate(22, onTouchdown = $$props.onTouchdown);
    		if ("onTouchup" in $$props) $$invalidate(23, onTouchup = $$props.onTouchup);
    		if ("onTouchover" in $$props) $$invalidate(24, onTouchover = $$props.onTouchover);
    		if ("onTouchout" in $$props) $$invalidate(25, onTouchout = $$props.onTouchout);
    		if ("onTouchdrag" in $$props) $$invalidate(26, onTouchdrag = $$props.onTouchdrag);
    		if ("onSelect" in $$props) $$invalidate(27, onSelect = $$props.onSelect);
    		if ("onDeselect" in $$props) $$invalidate(28, onDeselect = $$props.onDeselect);
    		if ("key" in $$props) $$invalidate(29, key = $$props.key);
    		if ("renderSettings" in $$props) $$invalidate(30, renderSettings = $$props.renderSettings);
    		if ("blockReindexing" in $$props) $$invalidate(31, blockReindexing = $$props.blockReindexing);
    		if ("clip" in $$props) $$invalidate(32, clip = $$props.clip);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		x,
    		y,
    		geometry,
    		fill,
    		stroke,
    		strokeWidth,
    		strokeOpacity,
    		fillOpacity,
    		opacity,
    		text,
    		fontFamily,
    		fontSize,
    		fontWeight,
    		rotation,
    		anchorPoint,
    		transition,
    		onClick,
    		onMousedown,
    		onMouseup,
    		onMouseover,
    		onMouseout,
    		onMousedrag,
    		onTouchdown,
    		onTouchup,
    		onTouchover,
    		onTouchout,
    		onTouchdrag,
    		onSelect,
    		onDeselect,
    		key,
    		renderSettings,
    		blockReindexing,
    		clip
    	];
    }

    class LabelLayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(
    			this,
    			options,
    			instance$5,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				x: 0,
    				y: 1,
    				geometry: 2,
    				fill: 3,
    				stroke: 4,
    				strokeWidth: 5,
    				strokeOpacity: 6,
    				fillOpacity: 7,
    				opacity: 8,
    				text: 9,
    				fontFamily: 10,
    				fontSize: 11,
    				fontWeight: 12,
    				rotation: 13,
    				anchorPoint: 14,
    				transition: 15,
    				onClick: 16,
    				onMousedown: 17,
    				onMouseup: 18,
    				onMouseover: 19,
    				onMouseout: 20,
    				onMousedrag: 21,
    				onTouchdown: 22,
    				onTouchup: 23,
    				onTouchover: 24,
    				onTouchout: 25,
    				onTouchdrag: 26,
    				onSelect: 27,
    				onDeselect: 28,
    				key: 29,
    				renderSettings: 30,
    				blockReindexing: 31,
    				clip: 32
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LabelLayer",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get x() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get geometry() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set geometry(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fill() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fill(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stroke() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stroke(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeWidth() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeWidth(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get strokeOpacity() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set strokeOpacity(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fillOpacity() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fillOpacity(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontFamily() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontFamily(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontSize() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontSize(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fontWeight() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fontWeight(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotation() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotation(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchorPoint() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchorPoint(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedown() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedown(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseup() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseup(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseover() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseover(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMouseout() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMouseout(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onMousedrag() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onMousedrag(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdown() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdown(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchup() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchup(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchover() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchover(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchout() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchout(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onTouchdrag() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onTouchdrag(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onSelect() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onSelect(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onDeselect() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onDeselect(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get key() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set key(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get renderSettings() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set renderSettings(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blockReindexing() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blockReindexing(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clip() {
    		throw new Error("<LabelLayer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clip(value) {
    		throw new Error("<LabelLayer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function parseHJust (hjust, xOffset, bbox) {
      const { minX: x1, maxX: x2 } = bbox;

      if (hjust === 'left') {
        return x1 - xOffset
      }

      if (hjust === 'right') {
        return x2 + xOffset
      }

      if (['center', 'centre'].includes(hjust)) {
        return (x2 - x1) / 2 + x1 + xOffset
      }

      if (hjust.constructor === Number) {
        return (x2 - x1) * hjust + x1
      }
    }

    function parseVJust (vjust, yOffset, bbox) {
      const { minY: y1, maxY: y2 } = bbox;

      if (vjust === 'top') {
        return y1 - yOffset
      }

      if (vjust === 'bottom') {
        return y2 + yOffset
      }

      if (['center', 'centre'].includes(vjust)) {
        return (y2 - y1) / 2 + y1 + yOffset
      }

      if (vjust.constructor === Number) {
        return (y2 - y1) * vjust + y1
      }
    }

    function getBaseLineCoordinatesXAxis (yAbsolute, sectionContext) {
      const { paddedBbox, finalScaleX, finalScaleY } = sectionContext;
      const { minX: x1, maxX: x2 } = paddedBbox;

      const x = [x1, x2].map(finalScaleX.invert);
      const y = [yAbsolute, yAbsolute].map(finalScaleY.invert);

      return {
        x: () => x,
        y: () => y
      }
    }

    function getBaseLineCoordinatesYAxis (xAbsolute, sectionContext) {
      const { paddedBbox, finalScaleX, finalScaleY } = sectionContext;
      const { minY: y1, maxY: y2 } = paddedBbox;

      const x = [xAbsolute, xAbsolute].map(finalScaleX.invert);
      const y = [y1, y2].map(finalScaleY.invert);

      return {
        x: () => x,
        y: () => y
      }
    }

    function getTickPositions (tickValuesArray, scale, tickCount, tickExtra, zoomIdentity) {
      let ticks;

      if (Array.isArray(tickValuesArray) && tickValuesArray.length > 0) {
        ticks = tickValuesArray;
      } else if (isContinuous(scale)) {
        ticks = getContinuousTicks(scale, tickCount, zoomIdentity);
      } else if ('domain' in scale) {
        ticks = scale.domain();
      } else {
        throw new Error(`Couldn't construct axis. Please provide 'tickValues' or a scale with
      either a 'ticks' or a 'domain' method.`)
      }

      if (tickExtra && 'domain' in scale && ticks[0] !== scale.domain()[0]) {
        ticks.unshift(scale.domain()[0]);
      }

      return ticks
    }

    function isContinuous (scale) {
      return 'ticks' in scale
    }

    function getContinuousTicks (scale, tickCount, zoomIdentity) {
      if (zoomIdentity) {
        const rescaledDomain = rescale(scale, zoomIdentity);
        return scale.copy().domain(rescaledDomain).ticks(tickCount)
      }

      return scale.ticks(tickCount)
    }

    // https://github.com/d3/d3-zoom#transform_rescaleX
    function rescale (scale, { k, t }) {
      const rescaledRange = scale.range().map(r => (r - t) / k);
      const rescaledDomain = rescaledRange.map(scale.invert);
      return rescaledDomain
    }

    function getTickCoordinatesXAxis (
      ticks,
      yAbsolute,
      scaleX,
      finalScaleY,
      tickSize,
      flip
    ) {
      const offset = flip ? -tickSize : tickSize;
      const bandOffset = scaleX.bandwidth ? scaleX.bandwidth() / 2 : 0;

      const yEndAbsolute = yAbsolute + offset;

      const yCoordsTick = [
        finalScaleY.invert(yAbsolute),
        finalScaleY.invert(yEndAbsolute)
      ];

      const x = ticks.map(t => scaleX(t) + bandOffset).map(t => [t, t]);
      const y = generateArrayOfLength(yCoordsTick, ticks.length);

      return {
        x: () => x,
        y: () => y
      }
    }

    function getTickCoordinatesYAxis (
      ticks,
      xAbsolute,
      scaleY,
      finalScaleX,
      tickSize,
      flip
    ) {
      const offset = flip ? tickSize : -tickSize;
      const bandOffset = scaleY.bandwidth ? scaleY.bandwidth() / 2 : 0;

      const xEndAbsolute = xAbsolute + offset;

      const xCoordsTick = [
        finalScaleX.invert(xAbsolute),
        finalScaleX.invert(xEndAbsolute)
      ];

      const x = generateArrayOfLength(xCoordsTick, ticks.length);
      const y = ticks.map(t => scaleY(t) + bandOffset).map(t => [t, t]);

      return {
        x: () => x,
        y: () => y
      }
    }

    function getFormat (labelFormat, scale, numberOfTicks) {
      if (labelFormat) return labelFormat
      if ('tickFormat' in scale) return scale.tickFormat(numberOfTicks)

      return x => x
    }

    function getTickLabelCoordinatesXAxis (
      tickCoordinates,
      { finalScaleY },
      labelOffset,
      flip
    ) {
      const x = tickCoordinates.x().map(x => x[0]);

      const y = tickCoordinates.y().map(y => {
        const yEnd = y[1];
        const yEndAbsolute = finalScaleY(yEnd);

        const yLabelAbsolute = flip
          ? yEndAbsolute - labelOffset
          : yEndAbsolute + labelOffset;

        return finalScaleY.invert(yLabelAbsolute)
      });

      return {
        x: () => x,
        y: () => y
      }
    }

    function getTickLabelCoordinatesYAxis (
      tickCoordinates,
      { finalScaleX },
      labelOffset,
      flip
    ) {
      const x = tickCoordinates.x().map(x => {
        const xEnd = x[1];
        const xEndAbsolute = finalScaleX(xEnd);

        const xLabelAbsolute = flip
          ? xEndAbsolute + labelOffset
          : xEndAbsolute - labelOffset;

        return finalScaleX.invert(xLabelAbsolute)
      });

      const y = tickCoordinates.y().map(y => y[0]);

      return {
        x: () => x,
        y: () => y
      }
    }

    // from https://stackoverflow.com/a/21015393
    function getTextWidth (text, fontSize, fontFamily) {
      let canvas;
      if (typeof document === 'undefined') {
        // if we don't have document/canvas available
        // assume ratio width to height is 0.8
        const length = text.length;
        return length * 0.8 * fontSize
      } else {
        // re-use canvas object for better performance
        canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
        const context = canvas.getContext('2d');
        context.font = fontSize + ' ' + fontFamily;
        const metrics = context.measureText(text);
        return metrics.width
      }
    }

    function getTitleCoordinatesXAxis (
      hjust,
      xOffset,
      vjust,
      yOffset,
      sectionContext,
      flip,
      axisHeight,
      fontSize,
      yAbsoluteAxis
    ) {
      const heightOffset = getHeightOffset(yOffset, flip, axisHeight, fontSize);

      const xAbsolute = parseHJust(hjust, xOffset, sectionContext.paddedBbox);
      const yAbsolute = vjust === 'axis'
        ? yAbsoluteAxis + heightOffset
        : parseVJust(vjust, yOffset, sectionContext.paddedBbox) + heightOffset;

      const { finalScaleX, finalScaleY } = sectionContext;

      const x = finalScaleX.invert(xAbsolute);
      const y = finalScaleY.invert(yAbsolute);

      return {
        x: () => x,
        y: () => y
      }
    }

    function getHeightOffset (offset, flip, axisHeight, fontSize) {
      if (offset === 'axis') {
        return flip
          ? -(axisHeight + 1) - fontSize
          : axisHeight + 1
      }

      if (offset.constructor !== Number) {
        throw new Error('yOffset must be a Number')
      }

      return offset
    }

    function getTitleCoordinatesYAxis (
      hjust,
      xOffset,
      vjust,
      yOffset,
      sectionContext,
      flip,
      axisWidth,
      fontSize,
      xAbsoluteAxis
    ) {
      const widthOffset = getWidthOffset(xOffset, flip, axisWidth);
      const xAbsolute = hjust === 'axis'
        ? xAbsoluteAxis + widthOffset
        : parseHJust(hjust, xOffset, sectionContext.paddedBbox);
      const yAbsolute = parseHJust(vjust, yOffset, sectionContext.paddedBbox);

      const { finalScaleX, finalScaleY } = sectionContext;

      const x = finalScaleX.invert(xAbsolute);
      const y = finalScaleY.invert(yAbsolute);

      return {
        x: () => x,
        y: () => y
      }
    }

    function getWidthOffset (offset, flip, axisWidth, fontSize) {
      if (offset === 'axis') {
        return flip
          ? axisWidth + 5
          : -axisWidth - 5
      }

      if (offset.constructor !== Number) {
        throw new Error('xOffset must be a Number')
      }

      return offset
    }

    /* node_modules/@snlab/florence/src/components/Guides/Axes/XAxis.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1$3 } = globals;
    const file$4 = "node_modules/@snlab/florence/src/components/Guides/Axes/XAxis.svelte";

    // (126:2) {#if baseLine}
    function create_if_block_2$1(ctx) {
    	let line;
    	let current;

    	const line_spread_levels = [
    		/*baseLineCoordinates*/ ctx[25],
    		{ strokeWidth: /*baseLineWidth*/ ctx[3] },
    		{ opacity: /*baseLineOpacity*/ ctx[2] },
    		{ stroke: /*baseLineColor*/ ctx[1] },
    		{ clip: /*clip*/ ctx[23] }
    	];

    	let line_props = {};

    	for (let i = 0; i < line_spread_levels.length; i += 1) {
    		line_props = assign(line_props, line_spread_levels[i]);
    	}

    	line = new Line({ props: line_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(line.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(line, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const line_changes = (dirty[0] & /*baseLineCoordinates, baseLineWidth, baseLineOpacity, baseLineColor, clip*/ 41943054)
    			? get_spread_update(line_spread_levels, [
    					dirty[0] & /*baseLineCoordinates*/ 33554432 && get_spread_object(/*baseLineCoordinates*/ ctx[25]),
    					dirty[0] & /*baseLineWidth*/ 8 && { strokeWidth: /*baseLineWidth*/ ctx[3] },
    					dirty[0] & /*baseLineOpacity*/ 4 && { opacity: /*baseLineOpacity*/ ctx[2] },
    					dirty[0] & /*baseLineColor*/ 2 && { stroke: /*baseLineColor*/ ctx[1] },
    					dirty[0] & /*clip*/ 8388608 && { clip: /*clip*/ ctx[23] }
    				])
    			: {};

    			line.$set(line_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(line.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(line.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(line, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(126:2) {#if baseLine}",
    		ctx
    	});

    	return block;
    }

    // (136:2) {#if ticks}
    function create_if_block_1$1(ctx) {
    	let linelayer;
    	let labellayer;
    	let current;

    	const linelayer_spread_levels = [
    		/*tickCoordinates*/ ctx[24],
    		{ strokeWidth: /*tickWidth*/ ctx[5] },
    		{ opacity: /*tickOpacity*/ ctx[7] },
    		{ stroke: /*tickColor*/ ctx[6] },
    		{ transition: /*transition*/ ctx[22] },
    		{ clip: /*clip*/ ctx[23] }
    	];

    	let linelayer_props = {};

    	for (let i = 0; i < linelayer_spread_levels.length; i += 1) {
    		linelayer_props = assign(linelayer_props, linelayer_spread_levels[i]);
    	}

    	linelayer = new LineLayer({ props: linelayer_props, $$inline: true });

    	const labellayer_spread_levels = [
    		/*tickLabelCoordinates*/ ctx[27],
    		{ text: /*tickLabelText*/ ctx[26] },
    		{
    			anchorPoint: /*labelAnchorPoint*/ ctx[28]
    		},
    		{ rotation: /*labelRotate*/ ctx[8] },
    		{ fontFamily: /*labelFont*/ ctx[9] },
    		{ fontSize: /*labelFontSize*/ ctx[10] },
    		{ fontWeight: /*labelFontWeight*/ ctx[11] },
    		{ opacity: /*labelOpacity*/ ctx[12] },
    		{ fill: /*labelColor*/ ctx[13] },
    		{ transition: /*transition*/ ctx[22] },
    		{ clip: /*clip*/ ctx[23] }
    	];

    	let labellayer_props = {};

    	for (let i = 0; i < labellayer_spread_levels.length; i += 1) {
    		labellayer_props = assign(labellayer_props, labellayer_spread_levels[i]);
    	}

    	labellayer = new LabelLayer({ props: labellayer_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(linelayer.$$.fragment);
    			create_component(labellayer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(linelayer, target, anchor);
    			mount_component(labellayer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const linelayer_changes = (dirty[0] & /*tickCoordinates, tickWidth, tickOpacity, tickColor, transition, clip*/ 29360352)
    			? get_spread_update(linelayer_spread_levels, [
    					dirty[0] & /*tickCoordinates*/ 16777216 && get_spread_object(/*tickCoordinates*/ ctx[24]),
    					dirty[0] & /*tickWidth*/ 32 && { strokeWidth: /*tickWidth*/ ctx[5] },
    					dirty[0] & /*tickOpacity*/ 128 && { opacity: /*tickOpacity*/ ctx[7] },
    					dirty[0] & /*tickColor*/ 64 && { stroke: /*tickColor*/ ctx[6] },
    					dirty[0] & /*transition*/ 4194304 && { transition: /*transition*/ ctx[22] },
    					dirty[0] & /*clip*/ 8388608 && { clip: /*clip*/ ctx[23] }
    				])
    			: {};

    			linelayer.$set(linelayer_changes);

    			const labellayer_changes = (dirty[0] & /*tickLabelCoordinates, tickLabelText, labelAnchorPoint, labelRotate, labelFont, labelFontSize, labelFontWeight, labelOpacity, labelColor, transition, clip*/ 482361088)
    			? get_spread_update(labellayer_spread_levels, [
    					dirty[0] & /*tickLabelCoordinates*/ 134217728 && get_spread_object(/*tickLabelCoordinates*/ ctx[27]),
    					dirty[0] & /*tickLabelText*/ 67108864 && { text: /*tickLabelText*/ ctx[26] },
    					dirty[0] & /*labelAnchorPoint*/ 268435456 && {
    						anchorPoint: /*labelAnchorPoint*/ ctx[28]
    					},
    					dirty[0] & /*labelRotate*/ 256 && { rotation: /*labelRotate*/ ctx[8] },
    					dirty[0] & /*labelFont*/ 512 && { fontFamily: /*labelFont*/ ctx[9] },
    					dirty[0] & /*labelFontSize*/ 1024 && { fontSize: /*labelFontSize*/ ctx[10] },
    					dirty[0] & /*labelFontWeight*/ 2048 && { fontWeight: /*labelFontWeight*/ ctx[11] },
    					dirty[0] & /*labelOpacity*/ 4096 && { opacity: /*labelOpacity*/ ctx[12] },
    					dirty[0] & /*labelColor*/ 8192 && { fill: /*labelColor*/ ctx[13] },
    					dirty[0] & /*transition*/ 4194304 && { transition: /*transition*/ ctx[22] },
    					dirty[0] & /*clip*/ 8388608 && { clip: /*clip*/ ctx[23] }
    				])
    			: {};

    			labellayer.$set(labellayer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linelayer.$$.fragment, local);
    			transition_in(labellayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linelayer.$$.fragment, local);
    			transition_out(labellayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(linelayer, detaching);
    			destroy_component(labellayer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(136:2) {#if ticks}",
    		ctx
    	});

    	return block;
    }

    // (161:2) {#if title.length > 0}
    function create_if_block$1(ctx) {
    	let label;
    	let current;

    	const label_spread_levels = [
    		/*titleCoordinates*/ ctx[29],
    		{ text: /*title*/ ctx[14] },
    		{
    			anchorPoint: /*titleAnchorPoint*/ ctx[21]
    		},
    		{ rotation: /*titleRotation*/ ctx[20] },
    		{ fontFamily: /*titleFont*/ ctx[16] },
    		{ fontSize: /*titleFontSize*/ ctx[17] },
    		{ fontWeight: /*titleFontWeight*/ ctx[18] },
    		{ opacity: /*titleOpacity*/ ctx[19] },
    		{ fill: /*titleColor*/ ctx[15] },
    		{ clip: /*clip*/ ctx[23] }
    	];

    	let label_props = {};

    	for (let i = 0; i < label_spread_levels.length; i += 1) {
    		label_props = assign(label_props, label_spread_levels[i]);
    	}

    	label = new Label({ props: label_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = (dirty[0] & /*titleCoordinates, title, titleAnchorPoint, titleRotation, titleFont, titleFontSize, titleFontWeight, titleOpacity, titleColor, clip*/ 549437440)
    			? get_spread_update(label_spread_levels, [
    					dirty[0] & /*titleCoordinates*/ 536870912 && get_spread_object(/*titleCoordinates*/ ctx[29]),
    					dirty[0] & /*title*/ 16384 && { text: /*title*/ ctx[14] },
    					dirty[0] & /*titleAnchorPoint*/ 2097152 && {
    						anchorPoint: /*titleAnchorPoint*/ ctx[21]
    					},
    					dirty[0] & /*titleRotation*/ 1048576 && { rotation: /*titleRotation*/ ctx[20] },
    					dirty[0] & /*titleFont*/ 65536 && { fontFamily: /*titleFont*/ ctx[16] },
    					dirty[0] & /*titleFontSize*/ 131072 && { fontSize: /*titleFontSize*/ ctx[17] },
    					dirty[0] & /*titleFontWeight*/ 262144 && { fontWeight: /*titleFontWeight*/ ctx[18] },
    					dirty[0] & /*titleOpacity*/ 524288 && { opacity: /*titleOpacity*/ ctx[19] },
    					dirty[0] & /*titleColor*/ 32768 && { fill: /*titleColor*/ ctx[15] },
    					dirty[0] & /*clip*/ 8388608 && { clip: /*clip*/ ctx[23] }
    				])
    			: {};

    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(161:2) {#if title.length > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let g;
    	let if_block0_anchor;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*baseLine*/ ctx[0] && create_if_block_2$1(ctx);
    	let if_block1 = /*ticks*/ ctx[4] && create_if_block_1$1(ctx);
    	let if_block2 = /*title*/ ctx[14].length > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			if (if_block2) if_block2.c();
    			attr_dev(g, "class", "x-axis");
    			add_location(g, file$4, 123, 0, 3350);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$3("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			if (if_block0) if_block0.m(g, null);
    			append_dev(g, if_block0_anchor);
    			if (if_block1) if_block1.m(g, null);
    			append_dev(g, if_block1_anchor);
    			if (if_block2) if_block2.m(g, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*baseLine*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*baseLine*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(g, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*ticks*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*ticks*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(g, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*title*/ ctx[14].length > 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*title*/ 16384) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(g, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let scaleX;
    	let yAbsolute;
    	let baseLineCoordinates;
    	let tickPositions;
    	let tickCoordinates;
    	let format;
    	let tickLabelText;
    	let tickLabelCoordinates;
    	let labelAnchorPoint;
    	let axisHeight;
    	let titleCoordinates;
    	let $sectionContext;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("XAxis", slots, []);
    	let { flip = false } = $$props;
    	let { scale = undefined } = $$props;
    	let { baseLine = true } = $$props;
    	let { baseLineColor = "black" } = $$props;
    	let { baseLineOpacity = 1 } = $$props;
    	let { baseLineWidth = 1 } = $$props;
    	let { vjust = "bottom" } = $$props;
    	let { yOffset = 0 } = $$props;
    	let { ticks = true } = $$props;
    	let { tickCount = 10 } = $$props;
    	let { tickExtra = false } = $$props;
    	let { tickValues = undefined } = $$props;
    	let { tickSize = 5 } = $$props;
    	let { tickWidth = 0.5 } = $$props;
    	let { tickColor = "black" } = $$props;
    	let { tickOpacity = 1 } = $$props;
    	let { labelFormat = undefined } = $$props;
    	let { labelOffset = 2 } = $$props;
    	let { labelRotate = 0 } = $$props;
    	let { labelFont = "Helvetica" } = $$props;
    	let { labelFontSize = 10 } = $$props;
    	let { labelFontWeight = "normal" } = $$props;
    	let { labelOpacity = 1 } = $$props;
    	let { labelColor = "black" } = $$props;
    	let { titleHjust = "center" } = $$props;
    	let { titleXOffset = 0 } = $$props;
    	let { titleVjust = "axis" } = $$props;
    	let { titleYOffset = "axis" } = $$props;
    	let { title = "" } = $$props;
    	let { titleColor = "black" } = $$props;
    	let { titleFont = "Helvetica" } = $$props;
    	let { titleFontSize = "12" } = $$props;
    	let { titleFontWeight = "normal" } = $$props;
    	let { titleOpacity = 1 } = $$props;
    	let { titleRotation = 0 } = $$props;
    	let { titleAnchorPoint = "t" } = $$props;
    	let { transition = undefined } = $$props;
    	let { clip = false } = $$props;

    	// Contexts
    	const sectionContext = subscribe$2();

    	validate_store(sectionContext, "sectionContext");
    	component_subscribe($$self, sectionContext, value => $$invalidate(45, $sectionContext = value));

    	const writable_props = [
    		"flip",
    		"scale",
    		"baseLine",
    		"baseLineColor",
    		"baseLineOpacity",
    		"baseLineWidth",
    		"vjust",
    		"yOffset",
    		"ticks",
    		"tickCount",
    		"tickExtra",
    		"tickValues",
    		"tickSize",
    		"tickWidth",
    		"tickColor",
    		"tickOpacity",
    		"labelFormat",
    		"labelOffset",
    		"labelRotate",
    		"labelFont",
    		"labelFontSize",
    		"labelFontWeight",
    		"labelOpacity",
    		"labelColor",
    		"titleHjust",
    		"titleXOffset",
    		"titleVjust",
    		"titleYOffset",
    		"title",
    		"titleColor",
    		"titleFont",
    		"titleFontSize",
    		"titleFontWeight",
    		"titleOpacity",
    		"titleRotation",
    		"titleAnchorPoint",
    		"transition",
    		"clip"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<XAxis> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("flip" in $$props) $$invalidate(31, flip = $$props.flip);
    		if ("scale" in $$props) $$invalidate(32, scale = $$props.scale);
    		if ("baseLine" in $$props) $$invalidate(0, baseLine = $$props.baseLine);
    		if ("baseLineColor" in $$props) $$invalidate(1, baseLineColor = $$props.baseLineColor);
    		if ("baseLineOpacity" in $$props) $$invalidate(2, baseLineOpacity = $$props.baseLineOpacity);
    		if ("baseLineWidth" in $$props) $$invalidate(3, baseLineWidth = $$props.baseLineWidth);
    		if ("vjust" in $$props) $$invalidate(33, vjust = $$props.vjust);
    		if ("yOffset" in $$props) $$invalidate(34, yOffset = $$props.yOffset);
    		if ("ticks" in $$props) $$invalidate(4, ticks = $$props.ticks);
    		if ("tickCount" in $$props) $$invalidate(35, tickCount = $$props.tickCount);
    		if ("tickExtra" in $$props) $$invalidate(36, tickExtra = $$props.tickExtra);
    		if ("tickValues" in $$props) $$invalidate(37, tickValues = $$props.tickValues);
    		if ("tickSize" in $$props) $$invalidate(38, tickSize = $$props.tickSize);
    		if ("tickWidth" in $$props) $$invalidate(5, tickWidth = $$props.tickWidth);
    		if ("tickColor" in $$props) $$invalidate(6, tickColor = $$props.tickColor);
    		if ("tickOpacity" in $$props) $$invalidate(7, tickOpacity = $$props.tickOpacity);
    		if ("labelFormat" in $$props) $$invalidate(39, labelFormat = $$props.labelFormat);
    		if ("labelOffset" in $$props) $$invalidate(40, labelOffset = $$props.labelOffset);
    		if ("labelRotate" in $$props) $$invalidate(8, labelRotate = $$props.labelRotate);
    		if ("labelFont" in $$props) $$invalidate(9, labelFont = $$props.labelFont);
    		if ("labelFontSize" in $$props) $$invalidate(10, labelFontSize = $$props.labelFontSize);
    		if ("labelFontWeight" in $$props) $$invalidate(11, labelFontWeight = $$props.labelFontWeight);
    		if ("labelOpacity" in $$props) $$invalidate(12, labelOpacity = $$props.labelOpacity);
    		if ("labelColor" in $$props) $$invalidate(13, labelColor = $$props.labelColor);
    		if ("titleHjust" in $$props) $$invalidate(41, titleHjust = $$props.titleHjust);
    		if ("titleXOffset" in $$props) $$invalidate(42, titleXOffset = $$props.titleXOffset);
    		if ("titleVjust" in $$props) $$invalidate(43, titleVjust = $$props.titleVjust);
    		if ("titleYOffset" in $$props) $$invalidate(44, titleYOffset = $$props.titleYOffset);
    		if ("title" in $$props) $$invalidate(14, title = $$props.title);
    		if ("titleColor" in $$props) $$invalidate(15, titleColor = $$props.titleColor);
    		if ("titleFont" in $$props) $$invalidate(16, titleFont = $$props.titleFont);
    		if ("titleFontSize" in $$props) $$invalidate(17, titleFontSize = $$props.titleFontSize);
    		if ("titleFontWeight" in $$props) $$invalidate(18, titleFontWeight = $$props.titleFontWeight);
    		if ("titleOpacity" in $$props) $$invalidate(19, titleOpacity = $$props.titleOpacity);
    		if ("titleRotation" in $$props) $$invalidate(20, titleRotation = $$props.titleRotation);
    		if ("titleAnchorPoint" in $$props) $$invalidate(21, titleAnchorPoint = $$props.titleAnchorPoint);
    		if ("transition" in $$props) $$invalidate(22, transition = $$props.transition);
    		if ("clip" in $$props) $$invalidate(23, clip = $$props.clip);
    	};

    	$$self.$capture_state = () => ({
    		Line,
    		LineLayer,
    		Label,
    		LabelLayer,
    		SectionContext,
    		parseVJust,
    		getBaseLineCoordinatesXAxis,
    		getTickPositions,
    		getTickCoordinatesXAxis,
    		getFormat,
    		getTickLabelCoordinatesXAxis,
    		getTitleCoordinatesXAxis,
    		flip,
    		scale,
    		baseLine,
    		baseLineColor,
    		baseLineOpacity,
    		baseLineWidth,
    		vjust,
    		yOffset,
    		ticks,
    		tickCount,
    		tickExtra,
    		tickValues,
    		tickSize,
    		tickWidth,
    		tickColor,
    		tickOpacity,
    		labelFormat,
    		labelOffset,
    		labelRotate,
    		labelFont,
    		labelFontSize,
    		labelFontWeight,
    		labelOpacity,
    		labelColor,
    		titleHjust,
    		titleXOffset,
    		titleVjust,
    		titleYOffset,
    		title,
    		titleColor,
    		titleFont,
    		titleFontSize,
    		titleFontWeight,
    		titleOpacity,
    		titleRotation,
    		titleAnchorPoint,
    		transition,
    		clip,
    		sectionContext,
    		$sectionContext,
    		scaleX,
    		yAbsolute,
    		baseLineCoordinates,
    		tickPositions,
    		tickCoordinates,
    		format,
    		tickLabelText,
    		tickLabelCoordinates,
    		labelAnchorPoint,
    		axisHeight,
    		titleCoordinates
    	});

    	$$self.$inject_state = $$props => {
    		if ("flip" in $$props) $$invalidate(31, flip = $$props.flip);
    		if ("scale" in $$props) $$invalidate(32, scale = $$props.scale);
    		if ("baseLine" in $$props) $$invalidate(0, baseLine = $$props.baseLine);
    		if ("baseLineColor" in $$props) $$invalidate(1, baseLineColor = $$props.baseLineColor);
    		if ("baseLineOpacity" in $$props) $$invalidate(2, baseLineOpacity = $$props.baseLineOpacity);
    		if ("baseLineWidth" in $$props) $$invalidate(3, baseLineWidth = $$props.baseLineWidth);
    		if ("vjust" in $$props) $$invalidate(33, vjust = $$props.vjust);
    		if ("yOffset" in $$props) $$invalidate(34, yOffset = $$props.yOffset);
    		if ("ticks" in $$props) $$invalidate(4, ticks = $$props.ticks);
    		if ("tickCount" in $$props) $$invalidate(35, tickCount = $$props.tickCount);
    		if ("tickExtra" in $$props) $$invalidate(36, tickExtra = $$props.tickExtra);
    		if ("tickValues" in $$props) $$invalidate(37, tickValues = $$props.tickValues);
    		if ("tickSize" in $$props) $$invalidate(38, tickSize = $$props.tickSize);
    		if ("tickWidth" in $$props) $$invalidate(5, tickWidth = $$props.tickWidth);
    		if ("tickColor" in $$props) $$invalidate(6, tickColor = $$props.tickColor);
    		if ("tickOpacity" in $$props) $$invalidate(7, tickOpacity = $$props.tickOpacity);
    		if ("labelFormat" in $$props) $$invalidate(39, labelFormat = $$props.labelFormat);
    		if ("labelOffset" in $$props) $$invalidate(40, labelOffset = $$props.labelOffset);
    		if ("labelRotate" in $$props) $$invalidate(8, labelRotate = $$props.labelRotate);
    		if ("labelFont" in $$props) $$invalidate(9, labelFont = $$props.labelFont);
    		if ("labelFontSize" in $$props) $$invalidate(10, labelFontSize = $$props.labelFontSize);
    		if ("labelFontWeight" in $$props) $$invalidate(11, labelFontWeight = $$props.labelFontWeight);
    		if ("labelOpacity" in $$props) $$invalidate(12, labelOpacity = $$props.labelOpacity);
    		if ("labelColor" in $$props) $$invalidate(13, labelColor = $$props.labelColor);
    		if ("titleHjust" in $$props) $$invalidate(41, titleHjust = $$props.titleHjust);
    		if ("titleXOffset" in $$props) $$invalidate(42, titleXOffset = $$props.titleXOffset);
    		if ("titleVjust" in $$props) $$invalidate(43, titleVjust = $$props.titleVjust);
    		if ("titleYOffset" in $$props) $$invalidate(44, titleYOffset = $$props.titleYOffset);
    		if ("title" in $$props) $$invalidate(14, title = $$props.title);
    		if ("titleColor" in $$props) $$invalidate(15, titleColor = $$props.titleColor);
    		if ("titleFont" in $$props) $$invalidate(16, titleFont = $$props.titleFont);
    		if ("titleFontSize" in $$props) $$invalidate(17, titleFontSize = $$props.titleFontSize);
    		if ("titleFontWeight" in $$props) $$invalidate(18, titleFontWeight = $$props.titleFontWeight);
    		if ("titleOpacity" in $$props) $$invalidate(19, titleOpacity = $$props.titleOpacity);
    		if ("titleRotation" in $$props) $$invalidate(20, titleRotation = $$props.titleRotation);
    		if ("titleAnchorPoint" in $$props) $$invalidate(21, titleAnchorPoint = $$props.titleAnchorPoint);
    		if ("transition" in $$props) $$invalidate(22, transition = $$props.transition);
    		if ("clip" in $$props) $$invalidate(23, clip = $$props.clip);
    		if ("scaleX" in $$props) $$invalidate(46, scaleX = $$props.scaleX);
    		if ("yAbsolute" in $$props) $$invalidate(47, yAbsolute = $$props.yAbsolute);
    		if ("baseLineCoordinates" in $$props) $$invalidate(25, baseLineCoordinates = $$props.baseLineCoordinates);
    		if ("tickPositions" in $$props) $$invalidate(48, tickPositions = $$props.tickPositions);
    		if ("tickCoordinates" in $$props) $$invalidate(24, tickCoordinates = $$props.tickCoordinates);
    		if ("format" in $$props) $$invalidate(49, format = $$props.format);
    		if ("tickLabelText" in $$props) $$invalidate(26, tickLabelText = $$props.tickLabelText);
    		if ("tickLabelCoordinates" in $$props) $$invalidate(27, tickLabelCoordinates = $$props.tickLabelCoordinates);
    		if ("labelAnchorPoint" in $$props) $$invalidate(28, labelAnchorPoint = $$props.labelAnchorPoint);
    		if ("axisHeight" in $$props) $$invalidate(50, axisHeight = $$props.axisHeight);
    		if ("titleCoordinates" in $$props) $$invalidate(29, titleCoordinates = $$props.titleCoordinates);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*$sectionContext*/ 16384) {
    			// Make sure not polar
    			{
    				if ($sectionContext.transformation === "polar") {
    					throw new Error("Axes do'nt work with polar coordinates (for now)");
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*scale, $sectionContext*/ 16386) {
    			// Scale
    			$$invalidate(46, scaleX = scale
    			? scale.copy().range($sectionContext.rangeX)
    			: $sectionContext.scaleX);
    		}

    		if ($$self.$$.dirty[1] & /*vjust, yOffset, $sectionContext*/ 16396) {
    			// Absolute position (in pixels)
    			$$invalidate(47, yAbsolute = parseVJust(vjust, yOffset, $sectionContext.paddedBbox));
    		}

    		if ($$self.$$.dirty[1] & /*yAbsolute, $sectionContext*/ 81920) {
    			// Baseline
    			$$invalidate(25, baseLineCoordinates = getBaseLineCoordinatesXAxis(yAbsolute, $sectionContext));
    		}

    		if ($$self.$$.dirty[1] & /*tickValues, scaleX, tickCount, tickExtra, $sectionContext*/ 49264) {
    			// Ticks
    			$$invalidate(48, tickPositions = getTickPositions(tickValues, scaleX, tickCount, tickExtra, $sectionContext.zoomIdentity
    			? {
    					t: $sectionContext.zoomIdentity.x,
    					k: $sectionContext.zoomIdentity.kx
    				}
    			: undefined));
    		}

    		if ($$self.$$.dirty[1] & /*tickPositions, yAbsolute, scaleX, $sectionContext, tickSize, flip*/ 245889) {
    			$$invalidate(24, tickCoordinates = getTickCoordinatesXAxis(tickPositions, yAbsolute, scaleX, $sectionContext.finalScaleY, tickSize, flip));
    		}

    		if ($$self.$$.dirty[0] & /*ticks*/ 16 | $$self.$$.dirty[1] & /*labelFormat, $sectionContext*/ 16640) {
    			// Tick labels
    			$$invalidate(49, format = getFormat(labelFormat, $sectionContext.scaleX, ticks.length));
    		}

    		if ($$self.$$.dirty[1] & /*tickPositions, format*/ 393216) {
    			$$invalidate(26, tickLabelText = tickPositions.map(format));
    		}

    		if ($$self.$$.dirty[0] & /*tickCoordinates*/ 16777216 | $$self.$$.dirty[1] & /*$sectionContext, labelOffset, flip*/ 16897) {
    			$$invalidate(27, tickLabelCoordinates = getTickLabelCoordinatesXAxis(tickCoordinates, $sectionContext, labelOffset, flip));
    		}

    		if ($$self.$$.dirty[1] & /*flip*/ 1) {
    			$$invalidate(28, labelAnchorPoint = flip ? "b" : "t");
    		}

    		if ($$self.$$.dirty[0] & /*baseLineWidth, labelFontSize*/ 1032 | $$self.$$.dirty[1] & /*tickSize, labelOffset*/ 640) {
    			// Title
    			$$invalidate(50, axisHeight = baseLineWidth + tickSize + labelOffset + labelFontSize);
    		}

    		if ($$self.$$.dirty[0] & /*titleFontSize*/ 131072 | $$self.$$.dirty[1] & /*titleHjust, titleXOffset, titleVjust, titleYOffset, $sectionContext, flip, axisHeight, yAbsolute*/ 621569) {
    			$$invalidate(29, titleCoordinates = getTitleCoordinatesXAxis(titleHjust, titleXOffset, titleVjust, titleYOffset, $sectionContext, flip, axisHeight, titleFontSize, yAbsolute));
    		}
    	};

    	return [
    		baseLine,
    		baseLineColor,
    		baseLineOpacity,
    		baseLineWidth,
    		ticks,
    		tickWidth,
    		tickColor,
    		tickOpacity,
    		labelRotate,
    		labelFont,
    		labelFontSize,
    		labelFontWeight,
    		labelOpacity,
    		labelColor,
    		title,
    		titleColor,
    		titleFont,
    		titleFontSize,
    		titleFontWeight,
    		titleOpacity,
    		titleRotation,
    		titleAnchorPoint,
    		transition,
    		clip,
    		tickCoordinates,
    		baseLineCoordinates,
    		tickLabelText,
    		tickLabelCoordinates,
    		labelAnchorPoint,
    		titleCoordinates,
    		sectionContext,
    		flip,
    		scale,
    		vjust,
    		yOffset,
    		tickCount,
    		tickExtra,
    		tickValues,
    		tickSize,
    		labelFormat,
    		labelOffset,
    		titleHjust,
    		titleXOffset,
    		titleVjust,
    		titleYOffset,
    		$sectionContext,
    		scaleX,
    		yAbsolute,
    		tickPositions,
    		format,
    		axisHeight
    	];
    }

    class XAxis extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				flip: 31,
    				scale: 32,
    				baseLine: 0,
    				baseLineColor: 1,
    				baseLineOpacity: 2,
    				baseLineWidth: 3,
    				vjust: 33,
    				yOffset: 34,
    				ticks: 4,
    				tickCount: 35,
    				tickExtra: 36,
    				tickValues: 37,
    				tickSize: 38,
    				tickWidth: 5,
    				tickColor: 6,
    				tickOpacity: 7,
    				labelFormat: 39,
    				labelOffset: 40,
    				labelRotate: 8,
    				labelFont: 9,
    				labelFontSize: 10,
    				labelFontWeight: 11,
    				labelOpacity: 12,
    				labelColor: 13,
    				titleHjust: 41,
    				titleXOffset: 42,
    				titleVjust: 43,
    				titleYOffset: 44,
    				title: 14,
    				titleColor: 15,
    				titleFont: 16,
    				titleFontSize: 17,
    				titleFontWeight: 18,
    				titleOpacity: 19,
    				titleRotation: 20,
    				titleAnchorPoint: 21,
    				transition: 22,
    				clip: 23
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "XAxis",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get flip() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseLine() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseLine(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseLineColor() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseLineColor(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseLineOpacity() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseLineOpacity(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseLineWidth() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseLineWidth(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vjust() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vjust(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yOffset() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yOffset(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ticks() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickCount() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickCount(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickExtra() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickExtra(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickValues() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickValues(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickSize() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickSize(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickWidth() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickWidth(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickColor() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickColor(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickOpacity() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickOpacity(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFormat() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFormat(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelOffset() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelOffset(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelRotate() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelRotate(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFont() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFont(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFontSize() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFontSize(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFontWeight() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFontWeight(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelOpacity() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelOpacity(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelColor() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelColor(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleHjust() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleHjust(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleXOffset() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleXOffset(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleVjust() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleVjust(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleYOffset() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleYOffset(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleColor() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleColor(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleFont() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleFont(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleFontSize() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleFontSize(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleFontWeight() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleFontWeight(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleOpacity() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleOpacity(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleRotation() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleRotation(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleAnchorPoint() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleAnchorPoint(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clip() {
    		throw new Error_1$3("<XAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clip(value) {
    		throw new Error_1$3("<XAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@snlab/florence/src/components/Guides/Axes/YAxis.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1$2 } = globals;
    const file$3 = "node_modules/@snlab/florence/src/components/Guides/Axes/YAxis.svelte";

    // (127:2) {#if baseLine}
    function create_if_block_2(ctx) {
    	let line;
    	let current;

    	const line_spread_levels = [
    		/*baseLineCoordinates*/ ctx[26],
    		{ strokeWidth: /*baseLineWidth*/ ctx[3] },
    		{ opacity: /*baseLineOpacity*/ ctx[2] },
    		{ stroke: /*baseLineColor*/ ctx[1] },
    		{ clip: /*clip*/ ctx[23] }
    	];

    	let line_props = {};

    	for (let i = 0; i < line_spread_levels.length; i += 1) {
    		line_props = assign(line_props, line_spread_levels[i]);
    	}

    	line = new Line({ props: line_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(line.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(line, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const line_changes = (dirty[0] & /*baseLineCoordinates, baseLineWidth, baseLineOpacity, baseLineColor, clip*/ 75497486)
    			? get_spread_update(line_spread_levels, [
    					dirty[0] & /*baseLineCoordinates*/ 67108864 && get_spread_object(/*baseLineCoordinates*/ ctx[26]),
    					dirty[0] & /*baseLineWidth*/ 8 && { strokeWidth: /*baseLineWidth*/ ctx[3] },
    					dirty[0] & /*baseLineOpacity*/ 4 && { opacity: /*baseLineOpacity*/ ctx[2] },
    					dirty[0] & /*baseLineColor*/ 2 && { stroke: /*baseLineColor*/ ctx[1] },
    					dirty[0] & /*clip*/ 8388608 && { clip: /*clip*/ ctx[23] }
    				])
    			: {};

    			line.$set(line_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(line.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(line.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(line, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(127:2) {#if baseLine}",
    		ctx
    	});

    	return block;
    }

    // (137:2) {#if ticks}
    function create_if_block_1(ctx) {
    	let linelayer;
    	let labellayer;
    	let current;

    	const linelayer_spread_levels = [
    		/*tickCoordinates*/ ctx[24],
    		{ strokeWidth: /*tickWidth*/ ctx[5] },
    		{ opacity: /*tickOpacity*/ ctx[7] },
    		{ stroke: /*tickColor*/ ctx[6] },
    		{ transition: /*transition*/ ctx[22] },
    		{ clip: /*clip*/ ctx[23] }
    	];

    	let linelayer_props = {};

    	for (let i = 0; i < linelayer_spread_levels.length; i += 1) {
    		linelayer_props = assign(linelayer_props, linelayer_spread_levels[i]);
    	}

    	linelayer = new LineLayer({ props: linelayer_props, $$inline: true });

    	const labellayer_spread_levels = [
    		/*tickLabelCoordinates*/ ctx[27],
    		{ text: /*tickLabelText*/ ctx[25] },
    		{
    			anchorPoint: /*labelAnchorPoint*/ ctx[28]
    		},
    		{ rotation: /*labelRotate*/ ctx[8] },
    		{ fontFamily: /*labelFont*/ ctx[9] },
    		{ fontSize: /*labelFontSize*/ ctx[10] },
    		{ fontWeight: /*labelFontWeight*/ ctx[11] },
    		{ opacity: /*labelOpacity*/ ctx[12] },
    		{ fill: /*labelColor*/ ctx[13] },
    		{ transition: /*transition*/ ctx[22] },
    		{ clip: /*clip*/ ctx[23] }
    	];

    	let labellayer_props = {};

    	for (let i = 0; i < labellayer_spread_levels.length; i += 1) {
    		labellayer_props = assign(labellayer_props, labellayer_spread_levels[i]);
    	}

    	labellayer = new LabelLayer({ props: labellayer_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(linelayer.$$.fragment);
    			create_component(labellayer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(linelayer, target, anchor);
    			mount_component(labellayer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const linelayer_changes = (dirty[0] & /*tickCoordinates, tickWidth, tickOpacity, tickColor, transition, clip*/ 29360352)
    			? get_spread_update(linelayer_spread_levels, [
    					dirty[0] & /*tickCoordinates*/ 16777216 && get_spread_object(/*tickCoordinates*/ ctx[24]),
    					dirty[0] & /*tickWidth*/ 32 && { strokeWidth: /*tickWidth*/ ctx[5] },
    					dirty[0] & /*tickOpacity*/ 128 && { opacity: /*tickOpacity*/ ctx[7] },
    					dirty[0] & /*tickColor*/ 64 && { stroke: /*tickColor*/ ctx[6] },
    					dirty[0] & /*transition*/ 4194304 && { transition: /*transition*/ ctx[22] },
    					dirty[0] & /*clip*/ 8388608 && { clip: /*clip*/ ctx[23] }
    				])
    			: {};

    			linelayer.$set(linelayer_changes);

    			const labellayer_changes = (dirty[0] & /*tickLabelCoordinates, tickLabelText, labelAnchorPoint, labelRotate, labelFont, labelFontSize, labelFontWeight, labelOpacity, labelColor, transition, clip*/ 448806656)
    			? get_spread_update(labellayer_spread_levels, [
    					dirty[0] & /*tickLabelCoordinates*/ 134217728 && get_spread_object(/*tickLabelCoordinates*/ ctx[27]),
    					dirty[0] & /*tickLabelText*/ 33554432 && { text: /*tickLabelText*/ ctx[25] },
    					dirty[0] & /*labelAnchorPoint*/ 268435456 && {
    						anchorPoint: /*labelAnchorPoint*/ ctx[28]
    					},
    					dirty[0] & /*labelRotate*/ 256 && { rotation: /*labelRotate*/ ctx[8] },
    					dirty[0] & /*labelFont*/ 512 && { fontFamily: /*labelFont*/ ctx[9] },
    					dirty[0] & /*labelFontSize*/ 1024 && { fontSize: /*labelFontSize*/ ctx[10] },
    					dirty[0] & /*labelFontWeight*/ 2048 && { fontWeight: /*labelFontWeight*/ ctx[11] },
    					dirty[0] & /*labelOpacity*/ 4096 && { opacity: /*labelOpacity*/ ctx[12] },
    					dirty[0] & /*labelColor*/ 8192 && { fill: /*labelColor*/ ctx[13] },
    					dirty[0] & /*transition*/ 4194304 && { transition: /*transition*/ ctx[22] },
    					dirty[0] & /*clip*/ 8388608 && { clip: /*clip*/ ctx[23] }
    				])
    			: {};

    			labellayer.$set(labellayer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linelayer.$$.fragment, local);
    			transition_in(labellayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linelayer.$$.fragment, local);
    			transition_out(labellayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(linelayer, detaching);
    			destroy_component(labellayer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(137:2) {#if ticks}",
    		ctx
    	});

    	return block;
    }

    // (162:2) {#if title.length > 0}
    function create_if_block(ctx) {
    	let label;
    	let current;

    	const label_spread_levels = [
    		/*titleCoordinates*/ ctx[29],
    		{ text: /*title*/ ctx[14] },
    		{
    			anchorPoint: /*titleAnchorPoint*/ ctx[21]
    		},
    		{ rotation: /*titleRotation*/ ctx[20] },
    		{ fontFamily: /*titleFont*/ ctx[16] },
    		{ fontSize: /*titleFontSize*/ ctx[17] },
    		{ fontWeight: /*titleFontWeight*/ ctx[18] },
    		{ opacity: /*titleOpacity*/ ctx[19] },
    		{ fill: /*titleColor*/ ctx[15] },
    		{ clip: /*clip*/ ctx[23] }
    	];

    	let label_props = {};

    	for (let i = 0; i < label_spread_levels.length; i += 1) {
    		label_props = assign(label_props, label_spread_levels[i]);
    	}

    	label = new Label({ props: label_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(label.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(label, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const label_changes = (dirty[0] & /*titleCoordinates, title, titleAnchorPoint, titleRotation, titleFont, titleFontSize, titleFontWeight, titleOpacity, titleColor, clip*/ 549437440)
    			? get_spread_update(label_spread_levels, [
    					dirty[0] & /*titleCoordinates*/ 536870912 && get_spread_object(/*titleCoordinates*/ ctx[29]),
    					dirty[0] & /*title*/ 16384 && { text: /*title*/ ctx[14] },
    					dirty[0] & /*titleAnchorPoint*/ 2097152 && {
    						anchorPoint: /*titleAnchorPoint*/ ctx[21]
    					},
    					dirty[0] & /*titleRotation*/ 1048576 && { rotation: /*titleRotation*/ ctx[20] },
    					dirty[0] & /*titleFont*/ 65536 && { fontFamily: /*titleFont*/ ctx[16] },
    					dirty[0] & /*titleFontSize*/ 131072 && { fontSize: /*titleFontSize*/ ctx[17] },
    					dirty[0] & /*titleFontWeight*/ 262144 && { fontWeight: /*titleFontWeight*/ ctx[18] },
    					dirty[0] & /*titleOpacity*/ 524288 && { opacity: /*titleOpacity*/ ctx[19] },
    					dirty[0] & /*titleColor*/ 32768 && { fill: /*titleColor*/ ctx[15] },
    					dirty[0] & /*clip*/ 8388608 && { clip: /*clip*/ ctx[23] }
    				])
    			: {};

    			label.$set(label_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(label.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(label.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(label, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(162:2) {#if title.length > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let g;
    	let if_block0_anchor;
    	let if_block1_anchor;
    	let current;
    	let if_block0 = /*baseLine*/ ctx[0] && create_if_block_2(ctx);
    	let if_block1 = /*ticks*/ ctx[4] && create_if_block_1(ctx);
    	let if_block2 = /*title*/ ctx[14].length > 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			if (if_block2) if_block2.c();
    			attr_dev(g, "class", "y-axis");
    			add_location(g, file$3, 124, 0, 3469);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$2("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			if (if_block0) if_block0.m(g, null);
    			append_dev(g, if_block0_anchor);
    			if (if_block1) if_block1.m(g, null);
    			append_dev(g, if_block1_anchor);
    			if (if_block2) if_block2.m(g, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*baseLine*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*baseLine*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(g, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*ticks*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*ticks*/ 16) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(g, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*title*/ ctx[14].length > 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*title*/ 16384) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(g, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let scaleY;
    	let xAbsolute;
    	let baseLineCoordinates;
    	let tickPositions;
    	let tickCoordinates;
    	let format;
    	let tickLabelText;
    	let tickLabelCoordinates;
    	let labelAnchorPoint;
    	let tickLabelWidth;
    	let axisWidth;
    	let titleCoordinates;
    	let $sectionContext;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("YAxis", slots, []);
    	let { flip = false } = $$props;
    	let { scale = undefined } = $$props;
    	let { baseLine = true } = $$props;
    	let { baseLineColor = "black" } = $$props;
    	let { baseLineOpacity = 1 } = $$props;
    	let { baseLineWidth = 1 } = $$props;
    	let { hjust = "left" } = $$props;
    	let { xOffset = 0 } = $$props;
    	let { ticks = true } = $$props;
    	let { tickCount = 10 } = $$props;
    	let { tickExtra = false } = $$props;
    	let { tickValues = undefined } = $$props;
    	let { tickSize = 5 } = $$props;
    	let { tickWidth = 0.5 } = $$props;
    	let { tickColor = "black" } = $$props;
    	let { tickOpacity = 1 } = $$props;
    	let { labelFormat = undefined } = $$props;
    	let { labelOffset = 2 } = $$props;
    	let { labelRotate = 0 } = $$props;
    	let { labelFont = "Helvetica" } = $$props;
    	let { labelFontSize = 10 } = $$props;
    	let { labelFontWeight = "normal" } = $$props;
    	let { labelOpacity = 1 } = $$props;
    	let { labelColor = "black" } = $$props;
    	let { titleHjust = "axis" } = $$props;
    	let { titleXOffset = "axis" } = $$props;
    	let { titleVjust = "center" } = $$props;
    	let { titleYOffset = 0 } = $$props;
    	let { title = "" } = $$props;
    	let { titleColor = "black" } = $$props;
    	let { titleFont = "Helvetica" } = $$props;
    	let { titleFontSize = "12" } = $$props;
    	let { titleFontWeight = "normal" } = $$props;
    	let { titleOpacity = 1 } = $$props;
    	let { titleRotation = -90 } = $$props;
    	let { titleAnchorPoint = "center" } = $$props;
    	let { transition = undefined } = $$props;
    	let { clip = false } = $$props;

    	// Contexts
    	const sectionContext = subscribe$2();

    	validate_store(sectionContext, "sectionContext");
    	component_subscribe($$self, sectionContext, value => $$invalidate(45, $sectionContext = value));

    	const writable_props = [
    		"flip",
    		"scale",
    		"baseLine",
    		"baseLineColor",
    		"baseLineOpacity",
    		"baseLineWidth",
    		"hjust",
    		"xOffset",
    		"ticks",
    		"tickCount",
    		"tickExtra",
    		"tickValues",
    		"tickSize",
    		"tickWidth",
    		"tickColor",
    		"tickOpacity",
    		"labelFormat",
    		"labelOffset",
    		"labelRotate",
    		"labelFont",
    		"labelFontSize",
    		"labelFontWeight",
    		"labelOpacity",
    		"labelColor",
    		"titleHjust",
    		"titleXOffset",
    		"titleVjust",
    		"titleYOffset",
    		"title",
    		"titleColor",
    		"titleFont",
    		"titleFontSize",
    		"titleFontWeight",
    		"titleOpacity",
    		"titleRotation",
    		"titleAnchorPoint",
    		"transition",
    		"clip"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<YAxis> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("flip" in $$props) $$invalidate(31, flip = $$props.flip);
    		if ("scale" in $$props) $$invalidate(32, scale = $$props.scale);
    		if ("baseLine" in $$props) $$invalidate(0, baseLine = $$props.baseLine);
    		if ("baseLineColor" in $$props) $$invalidate(1, baseLineColor = $$props.baseLineColor);
    		if ("baseLineOpacity" in $$props) $$invalidate(2, baseLineOpacity = $$props.baseLineOpacity);
    		if ("baseLineWidth" in $$props) $$invalidate(3, baseLineWidth = $$props.baseLineWidth);
    		if ("hjust" in $$props) $$invalidate(33, hjust = $$props.hjust);
    		if ("xOffset" in $$props) $$invalidate(34, xOffset = $$props.xOffset);
    		if ("ticks" in $$props) $$invalidate(4, ticks = $$props.ticks);
    		if ("tickCount" in $$props) $$invalidate(35, tickCount = $$props.tickCount);
    		if ("tickExtra" in $$props) $$invalidate(36, tickExtra = $$props.tickExtra);
    		if ("tickValues" in $$props) $$invalidate(37, tickValues = $$props.tickValues);
    		if ("tickSize" in $$props) $$invalidate(38, tickSize = $$props.tickSize);
    		if ("tickWidth" in $$props) $$invalidate(5, tickWidth = $$props.tickWidth);
    		if ("tickColor" in $$props) $$invalidate(6, tickColor = $$props.tickColor);
    		if ("tickOpacity" in $$props) $$invalidate(7, tickOpacity = $$props.tickOpacity);
    		if ("labelFormat" in $$props) $$invalidate(39, labelFormat = $$props.labelFormat);
    		if ("labelOffset" in $$props) $$invalidate(40, labelOffset = $$props.labelOffset);
    		if ("labelRotate" in $$props) $$invalidate(8, labelRotate = $$props.labelRotate);
    		if ("labelFont" in $$props) $$invalidate(9, labelFont = $$props.labelFont);
    		if ("labelFontSize" in $$props) $$invalidate(10, labelFontSize = $$props.labelFontSize);
    		if ("labelFontWeight" in $$props) $$invalidate(11, labelFontWeight = $$props.labelFontWeight);
    		if ("labelOpacity" in $$props) $$invalidate(12, labelOpacity = $$props.labelOpacity);
    		if ("labelColor" in $$props) $$invalidate(13, labelColor = $$props.labelColor);
    		if ("titleHjust" in $$props) $$invalidate(41, titleHjust = $$props.titleHjust);
    		if ("titleXOffset" in $$props) $$invalidate(42, titleXOffset = $$props.titleXOffset);
    		if ("titleVjust" in $$props) $$invalidate(43, titleVjust = $$props.titleVjust);
    		if ("titleYOffset" in $$props) $$invalidate(44, titleYOffset = $$props.titleYOffset);
    		if ("title" in $$props) $$invalidate(14, title = $$props.title);
    		if ("titleColor" in $$props) $$invalidate(15, titleColor = $$props.titleColor);
    		if ("titleFont" in $$props) $$invalidate(16, titleFont = $$props.titleFont);
    		if ("titleFontSize" in $$props) $$invalidate(17, titleFontSize = $$props.titleFontSize);
    		if ("titleFontWeight" in $$props) $$invalidate(18, titleFontWeight = $$props.titleFontWeight);
    		if ("titleOpacity" in $$props) $$invalidate(19, titleOpacity = $$props.titleOpacity);
    		if ("titleRotation" in $$props) $$invalidate(20, titleRotation = $$props.titleRotation);
    		if ("titleAnchorPoint" in $$props) $$invalidate(21, titleAnchorPoint = $$props.titleAnchorPoint);
    		if ("transition" in $$props) $$invalidate(22, transition = $$props.transition);
    		if ("clip" in $$props) $$invalidate(23, clip = $$props.clip);
    	};

    	$$self.$capture_state = () => ({
    		Line,
    		LineLayer,
    		Label,
    		LabelLayer,
    		SectionContext,
    		parseHJust,
    		getBaseLineCoordinatesYAxis,
    		getTickPositions,
    		getTickCoordinatesYAxis,
    		getFormat,
    		getTickLabelCoordinatesYAxis,
    		getTextWidth,
    		getTitleCoordinatesYAxis,
    		flip,
    		scale,
    		baseLine,
    		baseLineColor,
    		baseLineOpacity,
    		baseLineWidth,
    		hjust,
    		xOffset,
    		ticks,
    		tickCount,
    		tickExtra,
    		tickValues,
    		tickSize,
    		tickWidth,
    		tickColor,
    		tickOpacity,
    		labelFormat,
    		labelOffset,
    		labelRotate,
    		labelFont,
    		labelFontSize,
    		labelFontWeight,
    		labelOpacity,
    		labelColor,
    		titleHjust,
    		titleXOffset,
    		titleVjust,
    		titleYOffset,
    		title,
    		titleColor,
    		titleFont,
    		titleFontSize,
    		titleFontWeight,
    		titleOpacity,
    		titleRotation,
    		titleAnchorPoint,
    		transition,
    		clip,
    		sectionContext,
    		$sectionContext,
    		scaleY,
    		xAbsolute,
    		baseLineCoordinates,
    		tickPositions,
    		tickCoordinates,
    		format,
    		tickLabelText,
    		tickLabelCoordinates,
    		labelAnchorPoint,
    		tickLabelWidth,
    		axisWidth,
    		titleCoordinates
    	});

    	$$self.$inject_state = $$props => {
    		if ("flip" in $$props) $$invalidate(31, flip = $$props.flip);
    		if ("scale" in $$props) $$invalidate(32, scale = $$props.scale);
    		if ("baseLine" in $$props) $$invalidate(0, baseLine = $$props.baseLine);
    		if ("baseLineColor" in $$props) $$invalidate(1, baseLineColor = $$props.baseLineColor);
    		if ("baseLineOpacity" in $$props) $$invalidate(2, baseLineOpacity = $$props.baseLineOpacity);
    		if ("baseLineWidth" in $$props) $$invalidate(3, baseLineWidth = $$props.baseLineWidth);
    		if ("hjust" in $$props) $$invalidate(33, hjust = $$props.hjust);
    		if ("xOffset" in $$props) $$invalidate(34, xOffset = $$props.xOffset);
    		if ("ticks" in $$props) $$invalidate(4, ticks = $$props.ticks);
    		if ("tickCount" in $$props) $$invalidate(35, tickCount = $$props.tickCount);
    		if ("tickExtra" in $$props) $$invalidate(36, tickExtra = $$props.tickExtra);
    		if ("tickValues" in $$props) $$invalidate(37, tickValues = $$props.tickValues);
    		if ("tickSize" in $$props) $$invalidate(38, tickSize = $$props.tickSize);
    		if ("tickWidth" in $$props) $$invalidate(5, tickWidth = $$props.tickWidth);
    		if ("tickColor" in $$props) $$invalidate(6, tickColor = $$props.tickColor);
    		if ("tickOpacity" in $$props) $$invalidate(7, tickOpacity = $$props.tickOpacity);
    		if ("labelFormat" in $$props) $$invalidate(39, labelFormat = $$props.labelFormat);
    		if ("labelOffset" in $$props) $$invalidate(40, labelOffset = $$props.labelOffset);
    		if ("labelRotate" in $$props) $$invalidate(8, labelRotate = $$props.labelRotate);
    		if ("labelFont" in $$props) $$invalidate(9, labelFont = $$props.labelFont);
    		if ("labelFontSize" in $$props) $$invalidate(10, labelFontSize = $$props.labelFontSize);
    		if ("labelFontWeight" in $$props) $$invalidate(11, labelFontWeight = $$props.labelFontWeight);
    		if ("labelOpacity" in $$props) $$invalidate(12, labelOpacity = $$props.labelOpacity);
    		if ("labelColor" in $$props) $$invalidate(13, labelColor = $$props.labelColor);
    		if ("titleHjust" in $$props) $$invalidate(41, titleHjust = $$props.titleHjust);
    		if ("titleXOffset" in $$props) $$invalidate(42, titleXOffset = $$props.titleXOffset);
    		if ("titleVjust" in $$props) $$invalidate(43, titleVjust = $$props.titleVjust);
    		if ("titleYOffset" in $$props) $$invalidate(44, titleYOffset = $$props.titleYOffset);
    		if ("title" in $$props) $$invalidate(14, title = $$props.title);
    		if ("titleColor" in $$props) $$invalidate(15, titleColor = $$props.titleColor);
    		if ("titleFont" in $$props) $$invalidate(16, titleFont = $$props.titleFont);
    		if ("titleFontSize" in $$props) $$invalidate(17, titleFontSize = $$props.titleFontSize);
    		if ("titleFontWeight" in $$props) $$invalidate(18, titleFontWeight = $$props.titleFontWeight);
    		if ("titleOpacity" in $$props) $$invalidate(19, titleOpacity = $$props.titleOpacity);
    		if ("titleRotation" in $$props) $$invalidate(20, titleRotation = $$props.titleRotation);
    		if ("titleAnchorPoint" in $$props) $$invalidate(21, titleAnchorPoint = $$props.titleAnchorPoint);
    		if ("transition" in $$props) $$invalidate(22, transition = $$props.transition);
    		if ("clip" in $$props) $$invalidate(23, clip = $$props.clip);
    		if ("scaleY" in $$props) $$invalidate(46, scaleY = $$props.scaleY);
    		if ("xAbsolute" in $$props) $$invalidate(47, xAbsolute = $$props.xAbsolute);
    		if ("baseLineCoordinates" in $$props) $$invalidate(26, baseLineCoordinates = $$props.baseLineCoordinates);
    		if ("tickPositions" in $$props) $$invalidate(48, tickPositions = $$props.tickPositions);
    		if ("tickCoordinates" in $$props) $$invalidate(24, tickCoordinates = $$props.tickCoordinates);
    		if ("format" in $$props) $$invalidate(49, format = $$props.format);
    		if ("tickLabelText" in $$props) $$invalidate(25, tickLabelText = $$props.tickLabelText);
    		if ("tickLabelCoordinates" in $$props) $$invalidate(27, tickLabelCoordinates = $$props.tickLabelCoordinates);
    		if ("labelAnchorPoint" in $$props) $$invalidate(28, labelAnchorPoint = $$props.labelAnchorPoint);
    		if ("tickLabelWidth" in $$props) $$invalidate(50, tickLabelWidth = $$props.tickLabelWidth);
    		if ("axisWidth" in $$props) $$invalidate(51, axisWidth = $$props.axisWidth);
    		if ("titleCoordinates" in $$props) $$invalidate(29, titleCoordinates = $$props.titleCoordinates);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[1] & /*$sectionContext*/ 16384) {
    			// Make sure not polar
    			{
    				if ($sectionContext.transformation === "polar") {
    					throw new Error("Axes do'nt work with polar coordinates (for now)");
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*scale, $sectionContext*/ 16386) {
    			// Scale
    			$$invalidate(46, scaleY = scale
    			? scale.copy().range($sectionContext.rangeY)
    			: $sectionContext.scaleY);
    		}

    		if ($$self.$$.dirty[1] & /*hjust, xOffset, $sectionContext*/ 16396) {
    			// Absolute position (in pixels)
    			$$invalidate(47, xAbsolute = parseHJust(hjust, xOffset, $sectionContext.paddedBbox));
    		}

    		if ($$self.$$.dirty[1] & /*xAbsolute, $sectionContext*/ 81920) {
    			// Baseline
    			$$invalidate(26, baseLineCoordinates = getBaseLineCoordinatesYAxis(xAbsolute, $sectionContext));
    		}

    		if ($$self.$$.dirty[1] & /*tickValues, scaleY, tickCount, tickExtra, $sectionContext*/ 49264) {
    			// Ticks
    			$$invalidate(48, tickPositions = getTickPositions(tickValues, scaleY, tickCount, tickExtra, $sectionContext.zoomIdentity
    			? {
    					t: $sectionContext.zoomIdentity.y,
    					k: $sectionContext.zoomIdentity.ky
    				}
    			: undefined));
    		}

    		if ($$self.$$.dirty[1] & /*tickPositions, xAbsolute, scaleY, $sectionContext, tickSize, flip*/ 245889) {
    			$$invalidate(24, tickCoordinates = getTickCoordinatesYAxis(tickPositions, xAbsolute, scaleY, $sectionContext.finalScaleX, tickSize, flip));
    		}

    		if ($$self.$$.dirty[0] & /*ticks*/ 16 | $$self.$$.dirty[1] & /*labelFormat, $sectionContext*/ 16640) {
    			// Tick labels
    			$$invalidate(49, format = getFormat(labelFormat, $sectionContext.scaleY, ticks.length));
    		}

    		if ($$self.$$.dirty[1] & /*tickPositions, format*/ 393216) {
    			$$invalidate(25, tickLabelText = tickPositions.map(format));
    		}

    		if ($$self.$$.dirty[0] & /*tickCoordinates*/ 16777216 | $$self.$$.dirty[1] & /*$sectionContext, labelOffset, flip*/ 16897) {
    			$$invalidate(27, tickLabelCoordinates = getTickLabelCoordinatesYAxis(tickCoordinates, $sectionContext, labelOffset, flip));
    		}

    		if ($$self.$$.dirty[1] & /*flip*/ 1) {
    			$$invalidate(28, labelAnchorPoint = flip ? "l" : "r");
    		}

    		if ($$self.$$.dirty[0] & /*tickLabelText, labelFontSize, labelFont*/ 33555968) {
    			$$invalidate(50, tickLabelWidth = getTextWidth(tickLabelText[tickLabelText.length - 1], labelFontSize, labelFont));
    		}

    		if ($$self.$$.dirty[0] & /*baseLineWidth*/ 8 | $$self.$$.dirty[1] & /*tickSize, labelOffset, tickLabelWidth*/ 524928) {
    			// Title
    			$$invalidate(51, axisWidth = baseLineWidth + tickSize + labelOffset + tickLabelWidth);
    		}

    		if ($$self.$$.dirty[0] & /*titleFontSize*/ 131072 | $$self.$$.dirty[1] & /*titleHjust, titleXOffset, titleVjust, titleYOffset, $sectionContext, flip, axisWidth, xAbsolute*/ 1145857) {
    			$$invalidate(29, titleCoordinates = getTitleCoordinatesYAxis(titleHjust, titleXOffset, titleVjust, titleYOffset, $sectionContext, flip, axisWidth, titleFontSize, xAbsolute));
    		}
    	};

    	return [
    		baseLine,
    		baseLineColor,
    		baseLineOpacity,
    		baseLineWidth,
    		ticks,
    		tickWidth,
    		tickColor,
    		tickOpacity,
    		labelRotate,
    		labelFont,
    		labelFontSize,
    		labelFontWeight,
    		labelOpacity,
    		labelColor,
    		title,
    		titleColor,
    		titleFont,
    		titleFontSize,
    		titleFontWeight,
    		titleOpacity,
    		titleRotation,
    		titleAnchorPoint,
    		transition,
    		clip,
    		tickCoordinates,
    		tickLabelText,
    		baseLineCoordinates,
    		tickLabelCoordinates,
    		labelAnchorPoint,
    		titleCoordinates,
    		sectionContext,
    		flip,
    		scale,
    		hjust,
    		xOffset,
    		tickCount,
    		tickExtra,
    		tickValues,
    		tickSize,
    		labelFormat,
    		labelOffset,
    		titleHjust,
    		titleXOffset,
    		titleVjust,
    		titleYOffset,
    		$sectionContext,
    		scaleY,
    		xAbsolute,
    		tickPositions,
    		format,
    		tickLabelWidth,
    		axisWidth
    	];
    }

    class YAxis extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(
    			this,
    			options,
    			instance$3,
    			create_fragment$3,
    			safe_not_equal,
    			{
    				flip: 31,
    				scale: 32,
    				baseLine: 0,
    				baseLineColor: 1,
    				baseLineOpacity: 2,
    				baseLineWidth: 3,
    				hjust: 33,
    				xOffset: 34,
    				ticks: 4,
    				tickCount: 35,
    				tickExtra: 36,
    				tickValues: 37,
    				tickSize: 38,
    				tickWidth: 5,
    				tickColor: 6,
    				tickOpacity: 7,
    				labelFormat: 39,
    				labelOffset: 40,
    				labelRotate: 8,
    				labelFont: 9,
    				labelFontSize: 10,
    				labelFontWeight: 11,
    				labelOpacity: 12,
    				labelColor: 13,
    				titleHjust: 41,
    				titleXOffset: 42,
    				titleVjust: 43,
    				titleYOffset: 44,
    				title: 14,
    				titleColor: 15,
    				titleFont: 16,
    				titleFontSize: 17,
    				titleFontWeight: 18,
    				titleOpacity: 19,
    				titleRotation: 20,
    				titleAnchorPoint: 21,
    				transition: 22,
    				clip: 23
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "YAxis",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get flip() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flip(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get scale() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseLine() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseLine(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseLineColor() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseLineColor(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseLineOpacity() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseLineOpacity(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseLineWidth() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseLineWidth(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hjust() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hjust(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xOffset() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xOffset(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ticks() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickCount() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickCount(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickExtra() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickExtra(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickValues() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickValues(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickSize() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickSize(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickWidth() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickWidth(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickColor() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickColor(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickOpacity() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickOpacity(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFormat() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFormat(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelOffset() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelOffset(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelRotate() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelRotate(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFont() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFont(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFontSize() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFontSize(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFontWeight() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFontWeight(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelOpacity() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelOpacity(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelColor() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelColor(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleHjust() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleHjust(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleXOffset() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleXOffset(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleVjust() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleVjust(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleYOffset() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleYOffset(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleColor() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleColor(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleFont() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleFont(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleFontSize() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleFontSize(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleFontWeight() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleFontWeight(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleOpacity() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleOpacity(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleRotation() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleRotation(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleAnchorPoint() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleAnchorPoint(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clip() {
    		throw new Error_1$2("<YAxis>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clip(value) {
    		throw new Error_1$2("<YAxis>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function getCoordinatesXRaster (positions, scaleX, sectionContext) {
      const bandOffset = scaleX.bandwidth ? scaleX.bandwidth() / 2 : 0;

      const x = positions.map(p => scaleX(p) + bandOffset).map(p => [p, p]);
      const y = generateArrayOfLength(sectionContext.rangeY, positions.length);

      return {
        x: () => x,
        y: () => y
      }
    }

    function getCoordinatesYRaster (positions, scaleY, sectionContext) {
      const bandOffset = scaleY.bandwidth ? scaleY.bandwidth() / 2 : 0;

      const x = generateArrayOfLength(sectionContext.rangeX, positions.length);
      const y = positions.map(p => scaleY(p) + bandOffset).map(p => [p, p]);

      return {
        x: () => x,
        y: () => y
      }
    }

    /* node_modules/@snlab/florence/src/components/Guides/GridLines/XGridLines.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1$1 } = globals;
    const file$2 = "node_modules/@snlab/florence/src/components/Guides/GridLines/XGridLines.svelte";

    function create_fragment$2(ctx) {
    	let g;
    	let linelayer;
    	let current;

    	const linelayer_spread_levels = [
    		/*coordinates*/ ctx[4],
    		{ strokeWidth: /*width*/ ctx[0] },
    		{ opacity: /*opacity*/ ctx[2] },
    		{ stroke: /*color*/ ctx[1] },
    		{ transition: /*transition*/ ctx[3] }
    	];

    	let linelayer_props = {};

    	for (let i = 0; i < linelayer_spread_levels.length; i += 1) {
    		linelayer_props = assign(linelayer_props, linelayer_spread_levels[i]);
    	}

    	linelayer = new LineLayer({ props: linelayer_props, $$inline: true });

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			create_component(linelayer.$$.fragment);
    			attr_dev(g, "class", "x-grid-lines");
    			add_location(g, file$2, 49, 0, 1165);
    		},
    		l: function claim(nodes) {
    			throw new Error_1$1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			mount_component(linelayer, g, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const linelayer_changes = (dirty & /*coordinates, width, opacity, color, transition*/ 31)
    			? get_spread_update(linelayer_spread_levels, [
    					dirty & /*coordinates*/ 16 && get_spread_object(/*coordinates*/ ctx[4]),
    					dirty & /*width*/ 1 && { strokeWidth: /*width*/ ctx[0] },
    					dirty & /*opacity*/ 4 && { opacity: /*opacity*/ ctx[2] },
    					dirty & /*color*/ 2 && { stroke: /*color*/ ctx[1] },
    					dirty & /*transition*/ 8 && { transition: /*transition*/ ctx[3] }
    				])
    			: {};

    			linelayer.$set(linelayer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linelayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linelayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_component(linelayer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let scaleX;
    	let positions;
    	let coordinates;
    	let $sectionContext;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("XGridLines", slots, []);
    	let { scale = undefined } = $$props;
    	let { count = 10 } = $$props;
    	let { extra = false } = $$props;
    	let { values = undefined } = $$props;
    	let { width = 0.25 } = $$props;
    	let { color = "black" } = $$props;
    	let { opacity = 1 } = $$props;
    	let { transition = undefined } = $$props;

    	// Contexts
    	const sectionContext = subscribe$2();

    	validate_store(sectionContext, "sectionContext");
    	component_subscribe($$self, sectionContext, value => $$invalidate(10, $sectionContext = value));
    	const writable_props = ["scale", "count", "extra", "values", "width", "color", "opacity", "transition"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<XGridLines> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("scale" in $$props) $$invalidate(6, scale = $$props.scale);
    		if ("count" in $$props) $$invalidate(7, count = $$props.count);
    		if ("extra" in $$props) $$invalidate(8, extra = $$props.extra);
    		if ("values" in $$props) $$invalidate(9, values = $$props.values);
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    		if ("opacity" in $$props) $$invalidate(2, opacity = $$props.opacity);
    		if ("transition" in $$props) $$invalidate(3, transition = $$props.transition);
    	};

    	$$self.$capture_state = () => ({
    		LineLayer,
    		SectionContext,
    		getTickPositions,
    		getCoordinatesXRaster,
    		scale,
    		count,
    		extra,
    		values,
    		width,
    		color,
    		opacity,
    		transition,
    		sectionContext,
    		$sectionContext,
    		scaleX,
    		positions,
    		coordinates
    	});

    	$$self.$inject_state = $$props => {
    		if ("scale" in $$props) $$invalidate(6, scale = $$props.scale);
    		if ("count" in $$props) $$invalidate(7, count = $$props.count);
    		if ("extra" in $$props) $$invalidate(8, extra = $$props.extra);
    		if ("values" in $$props) $$invalidate(9, values = $$props.values);
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    		if ("opacity" in $$props) $$invalidate(2, opacity = $$props.opacity);
    		if ("transition" in $$props) $$invalidate(3, transition = $$props.transition);
    		if ("scaleX" in $$props) $$invalidate(11, scaleX = $$props.scaleX);
    		if ("positions" in $$props) $$invalidate(12, positions = $$props.positions);
    		if ("coordinates" in $$props) $$invalidate(4, coordinates = $$props.coordinates);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$sectionContext*/ 1024) {
    			// Make sure not polar
    			{
    				if ($sectionContext.transformation === "polar") {
    					throw new Error("Rasters do'nt work with polar coordinates (for now)");
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*scale, $sectionContext*/ 1088) {
    			// Scale
    			$$invalidate(11, scaleX = scale
    			? scale.copy().range($sectionContext.rangeX)
    			: $sectionContext.scaleX);
    		}

    		if ($$self.$$.dirty & /*values, scaleX, count, extra, $sectionContext*/ 3968) {
    			// Ticks
    			$$invalidate(12, positions = getTickPositions(values, scaleX, count, extra, $sectionContext.zoomIdentity
    			? {
    					t: $sectionContext.zoomIdentity.x,
    					k: $sectionContext.zoomIdentity.kx
    				}
    			: undefined));
    		}

    		if ($$self.$$.dirty & /*positions, scaleX, $sectionContext*/ 7168) {
    			$$invalidate(4, coordinates = getCoordinatesXRaster(positions, scaleX, $sectionContext));
    		}
    	};

    	return [
    		width,
    		color,
    		opacity,
    		transition,
    		coordinates,
    		sectionContext,
    		scale,
    		count,
    		extra,
    		values,
    		$sectionContext,
    		scaleX,
    		positions
    	];
    }

    class XGridLines extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			scale: 6,
    			count: 7,
    			extra: 8,
    			values: 9,
    			width: 0,
    			color: 1,
    			opacity: 2,
    			transition: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "XGridLines",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get scale() {
    		throw new Error_1$1("<XGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error_1$1("<XGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get count() {
    		throw new Error_1$1("<XGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error_1$1("<XGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extra() {
    		throw new Error_1$1("<XGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extra(value) {
    		throw new Error_1$1("<XGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get values() {
    		throw new Error_1$1("<XGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set values(value) {
    		throw new Error_1$1("<XGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error_1$1("<XGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error_1$1("<XGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error_1$1("<XGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error_1$1("<XGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error_1$1("<XGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error_1$1("<XGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error_1$1("<XGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error_1$1("<XGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@snlab/florence/src/components/Guides/GridLines/YGridLines.svelte generated by Svelte v3.37.0 */

    const { Error: Error_1 } = globals;
    const file$1 = "node_modules/@snlab/florence/src/components/Guides/GridLines/YGridLines.svelte";

    function create_fragment$1(ctx) {
    	let g;
    	let linelayer;
    	let current;

    	const linelayer_spread_levels = [
    		/*coordinates*/ ctx[4],
    		{ strokeWidth: /*width*/ ctx[0] },
    		{ opacity: /*opacity*/ ctx[2] },
    		{ stroke: /*color*/ ctx[1] },
    		{ transition: /*transition*/ ctx[3] }
    	];

    	let linelayer_props = {};

    	for (let i = 0; i < linelayer_spread_levels.length; i += 1) {
    		linelayer_props = assign(linelayer_props, linelayer_spread_levels[i]);
    	}

    	linelayer = new LineLayer({ props: linelayer_props, $$inline: true });

    	const block = {
    		c: function create() {
    			g = svg_element("g");
    			create_component(linelayer.$$.fragment);
    			attr_dev(g, "class", "y-grid-lines");
    			add_location(g, file$1, 49, 0, 1165);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, g, anchor);
    			mount_component(linelayer, g, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const linelayer_changes = (dirty & /*coordinates, width, opacity, color, transition*/ 31)
    			? get_spread_update(linelayer_spread_levels, [
    					dirty & /*coordinates*/ 16 && get_spread_object(/*coordinates*/ ctx[4]),
    					dirty & /*width*/ 1 && { strokeWidth: /*width*/ ctx[0] },
    					dirty & /*opacity*/ 4 && { opacity: /*opacity*/ ctx[2] },
    					dirty & /*color*/ 2 && { stroke: /*color*/ ctx[1] },
    					dirty & /*transition*/ 8 && { transition: /*transition*/ ctx[3] }
    				])
    			: {};

    			linelayer.$set(linelayer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(linelayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(linelayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(g);
    			destroy_component(linelayer);
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

    function instance$1($$self, $$props, $$invalidate) {
    	let scaleY;
    	let positions;
    	let coordinates;
    	let $sectionContext;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("YGridLines", slots, []);
    	let { scale = undefined } = $$props;
    	let { count = 10 } = $$props;
    	let { extra = false } = $$props;
    	let { values = undefined } = $$props;
    	let { width = 0.25 } = $$props;
    	let { color = "black" } = $$props;
    	let { opacity = 1 } = $$props;
    	let { transition = undefined } = $$props;

    	// Contexts
    	const sectionContext = subscribe$2();

    	validate_store(sectionContext, "sectionContext");
    	component_subscribe($$self, sectionContext, value => $$invalidate(10, $sectionContext = value));
    	const writable_props = ["scale", "count", "extra", "values", "width", "color", "opacity", "transition"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<YGridLines> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("scale" in $$props) $$invalidate(6, scale = $$props.scale);
    		if ("count" in $$props) $$invalidate(7, count = $$props.count);
    		if ("extra" in $$props) $$invalidate(8, extra = $$props.extra);
    		if ("values" in $$props) $$invalidate(9, values = $$props.values);
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    		if ("opacity" in $$props) $$invalidate(2, opacity = $$props.opacity);
    		if ("transition" in $$props) $$invalidate(3, transition = $$props.transition);
    	};

    	$$self.$capture_state = () => ({
    		LineLayer,
    		SectionContext,
    		getTickPositions,
    		getCoordinatesYRaster,
    		scale,
    		count,
    		extra,
    		values,
    		width,
    		color,
    		opacity,
    		transition,
    		sectionContext,
    		$sectionContext,
    		scaleY,
    		positions,
    		coordinates
    	});

    	$$self.$inject_state = $$props => {
    		if ("scale" in $$props) $$invalidate(6, scale = $$props.scale);
    		if ("count" in $$props) $$invalidate(7, count = $$props.count);
    		if ("extra" in $$props) $$invalidate(8, extra = $$props.extra);
    		if ("values" in $$props) $$invalidate(9, values = $$props.values);
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("color" in $$props) $$invalidate(1, color = $$props.color);
    		if ("opacity" in $$props) $$invalidate(2, opacity = $$props.opacity);
    		if ("transition" in $$props) $$invalidate(3, transition = $$props.transition);
    		if ("scaleY" in $$props) $$invalidate(11, scaleY = $$props.scaleY);
    		if ("positions" in $$props) $$invalidate(12, positions = $$props.positions);
    		if ("coordinates" in $$props) $$invalidate(4, coordinates = $$props.coordinates);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$sectionContext*/ 1024) {
    			// Make sure not polar
    			{
    				if ($sectionContext.transformation === "polar") {
    					throw new Error("Rasters do'nt work with polar coordinates (for now)");
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*scale, $sectionContext*/ 1088) {
    			// Scale
    			$$invalidate(11, scaleY = scale
    			? scale.copy().range($sectionContext.rangeY)
    			: $sectionContext.scaleY);
    		}

    		if ($$self.$$.dirty & /*values, scaleY, count, extra, $sectionContext*/ 3968) {
    			// Ticks
    			$$invalidate(12, positions = getTickPositions(values, scaleY, count, extra, $sectionContext.zoomIdentity
    			? {
    					t: $sectionContext.zoomIdentity.y,
    					k: $sectionContext.zoomIdentity.ky
    				}
    			: undefined));
    		}

    		if ($$self.$$.dirty & /*positions, scaleY, $sectionContext*/ 7168) {
    			$$invalidate(4, coordinates = getCoordinatesYRaster(positions, scaleY, $sectionContext));
    		}
    	};

    	return [
    		width,
    		color,
    		opacity,
    		transition,
    		coordinates,
    		sectionContext,
    		scale,
    		count,
    		extra,
    		values,
    		$sectionContext,
    		scaleY,
    		positions
    	];
    }

    class YGridLines extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init$4(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			scale: 6,
    			count: 7,
    			extra: 8,
    			values: 9,
    			width: 0,
    			color: 1,
    			opacity: 2,
    			transition: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "YGridLines",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get scale() {
    		throw new Error_1("<YGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set scale(value) {
    		throw new Error_1("<YGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get count() {
    		throw new Error_1("<YGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set count(value) {
    		throw new Error_1("<YGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get extra() {
    		throw new Error_1("<YGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set extra(value) {
    		throw new Error_1("<YGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get values() {
    		throw new Error_1("<YGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set values(value) {
    		throw new Error_1("<YGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error_1("<YGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error_1("<YGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error_1("<YGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error_1("<YGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error_1("<YGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error_1("<YGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error_1("<YGridLines>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error_1("<YGridLines>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.37.0 */

    const { Object: Object_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[20] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    // (230:12) {#each data as point}
    function create_each_block_1(ctx) {
    	let point;
    	let current;

    	point = new Point({
    			props: {
    				x: /*point*/ ctx[23].x,
    				y: /*point*/ ctx[23].y,
    				radius: 2,
    				fill: /*point*/ ctx[23].label == -1
    				? "#8B8B8B"
    				: /*labels*/ ctx[0][/*point*/ ctx[23].label].color,
    				opacity: 0.9,
    				transition: 2000
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(point.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(point, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const point_changes = {};
    			if (dirty & /*data*/ 2) point_changes.x = /*point*/ ctx[23].x;
    			if (dirty & /*data*/ 2) point_changes.y = /*point*/ ctx[23].y;

    			if (dirty & /*data, labels*/ 3) point_changes.fill = /*point*/ ctx[23].label == -1
    			? "#8B8B8B"
    			: /*labels*/ ctx[0][/*point*/ ctx[23].label].color;

    			point.$set(point_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(point.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(point.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(point, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(230:12) {#each data as point}",
    		ctx
    	});

    	return block;
    }

    // (242:12) {#each labels as label}
    function create_each_block(ctx) {
    	let point0;
    	let t;
    	let point1;
    	let current;

    	point0 = new Point({
    			props: {
    				x: /*label*/ ctx[20].x,
    				y: /*label*/ ctx[20].y,
    				radius: 6,
    				fill: /*label*/ ctx[20].color,
    				transition: 2000
    			},
    			$$inline: true
    		});

    	point1 = new Point({
    			props: {
    				x: /*label*/ ctx[20].x,
    				y: /*label*/ ctx[20].y,
    				radius: 10,
    				strokeWidth: 1,
    				stroke: /*label*/ ctx[20].color,
    				strokeOpacity: 0.5,
    				fill: /*label*/ ctx[20].color,
    				transition: 2000
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(point0.$$.fragment);
    			t = space();
    			create_component(point1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(point0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(point1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const point0_changes = {};
    			if (dirty & /*labels*/ 1) point0_changes.x = /*label*/ ctx[20].x;
    			if (dirty & /*labels*/ 1) point0_changes.y = /*label*/ ctx[20].y;
    			if (dirty & /*labels*/ 1) point0_changes.fill = /*label*/ ctx[20].color;
    			point0.$set(point0_changes);
    			const point1_changes = {};
    			if (dirty & /*labels*/ 1) point1_changes.x = /*label*/ ctx[20].x;
    			if (dirty & /*labels*/ 1) point1_changes.y = /*label*/ ctx[20].y;
    			if (dirty & /*labels*/ 1) point1_changes.stroke = /*label*/ ctx[20].color;
    			if (dirty & /*labels*/ 1) point1_changes.fill = /*label*/ ctx[20].color;
    			point1.$set(point1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(point0.$$.fragment, local);
    			transition_in(point1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(point0.$$.fragment, local);
    			transition_out(point1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(point0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(point1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(242:12) {#each labels as label}",
    		ctx
    	});

    	return block;
    }

    // (222:8) <Graphic             width={500}             height={500}             scaleX={[-6, MAX + 6]}             scaleY={[-6, MAX + 6]}             flipY             padding={20}         >
    function create_default_slot(ctx) {
    	let t0;
    	let t1;
    	let xaxis;
    	let t2;
    	let yaxis;
    	let t3;
    	let xgridlines;
    	let t4;
    	let ygridlines;
    	let current;
    	let each_value_1 = /*data*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*labels*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	xaxis = new XAxis({
    			props: {
    				baseLineColor: /*GRID_COLOR*/ ctx[2],
    				tickColor: /*GRID_COLOR*/ ctx[2],
    				labelColor: /*GRID_COLOR*/ ctx[2],
    				labelOpacity: 0
    			},
    			$$inline: true
    		});

    	yaxis = new YAxis({
    			props: {
    				baseLineColor: /*GRID_COLOR*/ ctx[2],
    				tickColor: /*GRID_COLOR*/ ctx[2],
    				labelColor: /*GRID_COLOR*/ ctx[2],
    				labelOpacity: 0
    			},
    			$$inline: true
    		});

    	xgridlines = new XGridLines({
    			props: {
    				color: /*GRID_COLOR*/ ctx[2],
    				opacity: 0.3
    			},
    			$$inline: true
    		});

    	ygridlines = new YGridLines({
    			props: {
    				color: /*GRID_COLOR*/ ctx[2],
    				opacity: 0.3
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(xaxis.$$.fragment);
    			t2 = space();
    			create_component(yaxis.$$.fragment);
    			t3 = space();
    			create_component(xgridlines.$$.fragment);
    			t4 = space();
    			create_component(ygridlines.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			mount_component(xaxis, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(yaxis, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(xgridlines, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(ygridlines, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data, labels*/ 3) {
    				each_value_1 = /*data*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(t0.parentNode, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*labels*/ 1) {
    				each_value = /*labels*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t1.parentNode, t1);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(xaxis.$$.fragment, local);
    			transition_in(yaxis.$$.fragment, local);
    			transition_in(xgridlines.$$.fragment, local);
    			transition_in(ygridlines.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(xaxis.$$.fragment, local);
    			transition_out(yaxis.$$.fragment, local);
    			transition_out(xgridlines.$$.fragment, local);
    			transition_out(ygridlines.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(xaxis, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(yaxis, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(xgridlines, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(ygridlines, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(222:8) <Graphic             width={500}             height={500}             scaleX={[-6, MAX + 6]}             scaleY={[-6, MAX + 6]}             flipY             padding={20}         >",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let graphic;
    	let t;
    	let div1;
    	let terminal;
    	let current;

    	graphic = new Graphic({
    			props: {
    				width: 500,
    				height: 500,
    				scaleX: [-6, /*MAX*/ ctx[3] + 6],
    				scaleY: [-6, /*MAX*/ ctx[3] + 6],
    				flipY: true,
    				padding: 20,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	terminal = new Terminal({ $$inline: true });
    	terminal.$on("assign", /*Assignment*/ ctx[5]);
    	terminal.$on("update", /*Update*/ ctx[4]);
    	terminal.$on("fit", /*Fit*/ ctx[6]);
    	terminal.$on("setLabel", /*setLabel*/ ctx[7]);
    	terminal.$on("setData", /*setData*/ ctx[8]);
    	terminal.$on("setError", /*setError*/ ctx[9]);
    	terminal.$on("reset", /*Reset*/ ctx[10]);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			create_component(graphic.$$.fragment);
    			t = space();
    			div1 = element("div");
    			create_component(terminal.$$.fragment);
    			attr_dev(div0, "class", "graph");
    			add_location(div0, file, 220, 4, 5436);
    			attr_dev(div1, "class", "controller svelte-31asw4");
    			add_location(div1, file, 277, 4, 7176);
    			attr_dev(main, "class", "svelte-31asw4");
    			add_location(main, file, 219, 0, 5425);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			mount_component(graphic, div0, null);
    			append_dev(main, t);
    			append_dev(main, div1);
    			mount_component(terminal, div1, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const graphic_changes = {};

    			if (dirty & /*$$scope, labels, data*/ 67108867) {
    				graphic_changes.$$scope = { dirty, ctx };
    			}

    			graphic.$set(graphic_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(graphic.$$.fragment, local);
    			transition_in(terminal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(graphic.$$.fragment, local);
    			transition_out(terminal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(graphic);
    			destroy_component(terminal);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let GRID_COLOR = "#80DDF2";
    	let LABELS_AMOUNT = 3;
    	let N_FOR_LABEL = 80;
    	let MAX = 100;

    	let COLORS = [
    		"#fe00fe",
    		"#fe007f",
    		"#fe0000",
    		"#febf00",
    		"#fefe00",
    		"#00fe00",
    		"#00fefe",
    		"#0080ff",
    		"#3f00fe"
    	];

    	// Note that error must be < max/2
    	let ERROR = 30;

    	// distance of centers from origin
    	let RADIUS = MAX / 2 - 20;

    	// Functions
    	const euclideanDistance = function (a, b) {
    		let x = a.x - b.x;
    		let y = a.y - b.y;
    		return Math.sqrt(x * x + y * y);
    	};

    	const generateData = function (nForLabel, centers) {
    		let data = [];

    		centers.forEach(({ x, y }) => {
    			for (let j = 0; j < nForLabel; j++) {
    				const angle = Math.PI * 2 * Math.random();

    				const point = {
    					x: x + ERROR * Math.cos(angle) * Math.random(),
    					y: y + ERROR * Math.sin(angle) * Math.random(),
    					label: -1
    				};

    				data.push(point);
    			}
    		});

    		return data;
    	};

    	const Mean = includes => {
    		const len = includes.length;
    		if (len == 0) return { x: MAX / 2, y: MAX / 2 };
    		let x_sum = 0;
    		let y_sum = 0;

    		includes.forEach(p => {
    			x_sum += p.x;
    			y_sum += p.y;
    		});

    		return { x: x_sum / len, y: y_sum / len };
    	};

    	// Initalizing Labels and Centers
    	let centers = [];

    	let labels = [];

    	for (let i = 0; i < LABELS_AMOUNT; i++) {
    		labels.push({
    			x: Math.random() * MAX,
    			y: Math.random() * MAX,
    			color: COLORS[i]
    		});

    		centers.push({
    			x: MAX / 2 + Math.cos(Math.PI / LABELS_AMOUNT * 2 * i) * RADIUS,
    			y: MAX / 2 + Math.sin(Math.PI / LABELS_AMOUNT * 2 * i) * RADIUS
    		});
    	}

    	// Gen data
    	let data = [];

    	data = generateData(N_FOR_LABEL, centers);

    	// Event Handler
    	// Recalculate means for observations assigned to each cluster.
    	function Update() {
    		labels.forEach((label, index) => {
    			Object.assign(label, Mean(data.filter(p => p.label == index)));
    		});

    		$$invalidate(0, labels);
    	}

    	// Assign each observation to the cluster with the nearest mean
    	function Assignment() {
    		let change = false;
    		let contain = [];

    		for (let i = 0; i < LABELS_AMOUNT; i++) {
    			contain.push(0);
    		}

    		data.forEach(p => {
    			let minDis = euclideanDistance(p, labels[0]);
    			let min = 0;

    			labels.forEach((label, index) => {
    				const dis = euclideanDistance(p, label);

    				if (dis < minDis) {
    					min = index;
    					minDis = dis;
    				}
    			});

    			if (!change) change = p.label != min;
    			contain[min] += 1;
    			p.label = min;
    			Print(`Assigned (${p.x}, ${p.y}) to ${min}`);
    		});

    		for (let i = 0; i < LABELS_AMOUNT; i++) {
    			Print(`Label ${i} now contain ${contain[i]} points`);
    		}

    		$$invalidate(0, labels);
    		return change;
    	}

    	// Assign each observation to the cluster with the nearest mean
    	function Fit() {
    		let interval = 1;
    		let change = Assignment();
    		Update();

    		let fit = setInterval(
    			() => {
    				change = Assignment();
    				Update();
    				interval++;

    				if (!change) {
    					Print(`Fitted after ${interval} interation(s)`);
    					clearInterval(fit);
    				}
    			},
    			2000
    		);
    	}

    	function setLabel(e) {
    		const num = e.detail.num;

    		if (LABELS_AMOUNT > num) {
    			data.map(p => {
    				p.label = -1;
    			});

    			$$invalidate(0, labels = labels.slice(0, num));
    		} else {
    			for (let i = LABELS_AMOUNT; i < num; i++) {
    				labels.push({
    					x: Math.random() * MAX,
    					y: Math.random() * MAX,
    					cor: COLORS[i]
    				});
    			}

    			$$invalidate(0, labels);
    		}

    		LABELS_AMOUNT = num;
    	}

    	function setData(e) {
    		const num = e.detail.num;
    		N_FOR_LABEL = num;
    		Reset();
    	}

    	function setError(e) {
    		const num = e.detail.num;
    		ERROR = num;
    		$$invalidate(1, data = generateData(N_FOR_LABEL, centers));
    	}

    	function Reset() {
    		centers = [];

    		for (let i = 0; i < LABELS_AMOUNT; i++) {
    			Object.assign(labels[i], {
    				x: Math.random() * MAX,
    				y: Math.random() * MAX
    			});

    			centers.push({
    				x: MAX / 2 + Math.cos(Math.PI / LABELS_AMOUNT * 2 * i) * RADIUS,
    				y: MAX / 2 + Math.sin(Math.PI / LABELS_AMOUNT * 2 * i) * RADIUS
    			});
    		}

    		centers = centers;
    		$$invalidate(0, labels);
    		$$invalidate(1, data = []);
    		$$invalidate(1, data = generateData(N_FOR_LABEL, centers));
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Terminal,
    		Graphic,
    		XAxis,
    		YAxis,
    		XGridLines,
    		YGridLines,
    		Point,
    		Print,
    		GRID_COLOR,
    		LABELS_AMOUNT,
    		N_FOR_LABEL,
    		MAX,
    		COLORS,
    		ERROR,
    		RADIUS,
    		euclideanDistance,
    		generateData,
    		Mean,
    		centers,
    		labels,
    		data,
    		Update,
    		Assignment,
    		Fit,
    		setLabel,
    		setData,
    		setError,
    		Reset
    	});

    	$$self.$inject_state = $$props => {
    		if ("GRID_COLOR" in $$props) $$invalidate(2, GRID_COLOR = $$props.GRID_COLOR);
    		if ("LABELS_AMOUNT" in $$props) LABELS_AMOUNT = $$props.LABELS_AMOUNT;
    		if ("N_FOR_LABEL" in $$props) N_FOR_LABEL = $$props.N_FOR_LABEL;
    		if ("MAX" in $$props) $$invalidate(3, MAX = $$props.MAX);
    		if ("COLORS" in $$props) COLORS = $$props.COLORS;
    		if ("ERROR" in $$props) ERROR = $$props.ERROR;
    		if ("RADIUS" in $$props) RADIUS = $$props.RADIUS;
    		if ("centers" in $$props) centers = $$props.centers;
    		if ("labels" in $$props) $$invalidate(0, labels = $$props.labels);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		labels,
    		data,
    		GRID_COLOR,
    		MAX,
    		Update,
    		Assignment,
    		Fit,
    		setLabel,
    		setData,
    		setError,
    		Reset
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init$4(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
