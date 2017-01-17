package com.calvinnix.web.controller;

import org.junit.Before;
import org.junit.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Created by Calvin on 1/17/17.
 */
public class AppControllerTest {
    private MockMvc mockMvc;
    private AppController controller;

    @Before
    public void setup() {
        controller = new AppController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void home_ShouldRenderApplication() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(view().name("application"));
    }
}
