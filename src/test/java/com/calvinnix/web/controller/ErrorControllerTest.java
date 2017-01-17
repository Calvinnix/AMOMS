package com.calvinnix.web.controller;

import org.junit.Before;
import org.junit.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

/**
 * Created by Calvin on 1/17/17.
 */
public class ErrorControllerTest {

    private MockMvc mockMvc;
    private org.springframework.boot.autoconfigure.web.ErrorController controller;

    @Before
    public void setup() {
        controller = new ErrorController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void error_ShouldRenderAccessDenied() throws Exception {
        mockMvc.perform(get("/error"))
                .andExpect(view().name("access_denied"));
    }

}
